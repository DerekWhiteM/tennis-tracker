import { type ActionFunction, json } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { AuthorizationError } from "remix-auth";
import { Form, Link, useActionData } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
    try {
        await authenticator.authenticate("user-pass", request, {
            successRedirect: "/",
            throwOnError: true,
        });
    } catch (error) {
        if (error instanceof Response) return error;
        if (error instanceof AuthorizationError) {
            return json({ error: { message: error.message } });
        }
    }
};

export default function Login() {
    const actionData = useActionData() as any;
    const error = actionData?.error;

    return (
        <Form method="post">
            <h1>Login</h1>
            <div>
                <label htmlFor="email">Email</label>
                <input name="email" required />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input name="password" type="password" required />
            </div>
            <button type="submit">Log In</button>
            {error && <div>{error.message}</div>}
            <div>
                <Link to="/forgot-password">Forgot your password?</Link>
            </div>
        </Form>
    );
}
