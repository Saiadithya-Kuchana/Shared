import e from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = e();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(e.json({limit:"32kb"}));
app.use(e.urlencoded({limit:"32kb",extended:true}));
app.use(cookieParser());

app.use(e.static("public", {
    maxAge: '7d', // Cache-Control max-age directive equivalent
    setHeaders: (res, path) => {
        if (path.endsWith('.html') || path.endsWith('.css') || path.endsWith('.js') || path.endsWith('.png') || path.endsWith('.jpg')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache for HTML, CSS, JS, images
            res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString()); // HTTP 1.0 expiration date
        }
    }
}));


import userRouter from './routes/user.routes.js'

app.use("/v1/users",userRouter)
export {app}
