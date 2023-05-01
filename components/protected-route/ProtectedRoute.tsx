import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { FC } from "react";



const WithProtectedRoute = <P extends object>(
    WrappedComponent: FC<P>
): FC<P> => {
    const Wrapper = (props: P) => {
        const router = useRouter();
        const { user, isFirstLogin } = useAuthContext();

        if (!user) {
            router.push("./signin");
            return null;
        }

        if (isFirstLogin) {
            router.push("./change-password");
            return null;
        }

        return !user ? null : <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export default WithProtectedRoute;