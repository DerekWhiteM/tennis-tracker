import { authenticator } from "./auth.server";
import { cssBundleHref } from "@remix-run/css-bundle";
import { json, redirect, type LinksFunction, type LoaderFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

const publicOnlyPaths = ["login", "forgot-password", "reset-password"];

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const isPublicOnly = publicOnlyPaths.includes(url.pathname.split("/")[1]);
    const user = await authenticator.isAuthenticated(request);
    if (!user && !isPublicOnly) return redirect("/login");
    return json({ user });
};

export const links: LinksFunction = () => [
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
