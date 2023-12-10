import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/session.server";
import { FormStrategy } from "remix-auth-form";
import { User } from "./models/user.server";
import { json } from "@remix-run/node";

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
    new FormStrategy(async ({ form }) => {
        const email = form.get("email");
        const password = form.get("password");
        const user = await User.verify(String(email), String(password));
        if (!user) throw Error("Invalid credentials");
        return user;
    }),
    // each strategy has a name and can be changed to use another one
    // same strategy multiple times, especially useful for the OAuth2 strategy.
    "user-pass"
);

function hasApiKey(request: Request): boolean {
    const apiKey = request.headers.get("apiKey");
    return apiKey === process.env.KEY;
}

export async function verifyAuth(request: Request) {
    const user = await authenticator.isAuthenticated(request);
    if (!user) throw json({ message: "Forbidden" }, { status: 403 });
    return user;
}

export async function verifyAuthWithKey(request: Request) {
    const user = await authenticator.isAuthenticated(request);
    if (!user && !hasApiKey(request)) {
        throw json({ message: "Forbidden" }, { status: 403 });
    }
}