import { Config } from "./interfaces/config.interface";

export default () => 
({
    port: process.env.PORT ?? 3000,
    firebaseConfig: {
        apiKey: process.env.FIREBASE_API_KEY,
        pathBase: process.env.FIREBASE_PATH_BASE,
        pathSignIn: process.env.FIREBASE_PATH_SIGN_IN
    }
} as Config);