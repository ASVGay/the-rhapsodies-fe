import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged, User} from 'firebase/auth';
import firebase_app from '@/firebase/config';
import {getDoc, setDoc, updateDoc} from "@firebase/firestore";
import {IAdditionalUserData} from "@/interfaces/User";
import {getAditionalUserData, getUserDocument} from "@/services/AuthenticationService";
import {router} from "next/client";

const auth = getAuth(firebase_app);
export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true
});

export const useAuthContext = () => useContext(AuthContext);
export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const handleSetUser = async (user: User | null) => {
        if (!user) {
            setUser(user);
            return;
        }

        const userDoc = await getDoc(getUserDocument(user));

        if(!userDoc.exists()) {
            const userData: IAdditionalUserData = {isFirstLogin: true}
            return await setDoc(getUserDocument(user), userData);
        }

        const additionalUserData = await getAditionalUserData(user);
        const authenticatedUser: AuthenticatedUser = {
            user,
            additionalUserData
        }

        setUser(authenticatedUser)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            await handleSetUser(user)
            setLoading(false)
        });
        return () => unsubscribe();
    }, []);


    return (
        <AuthContext.Provider value={{user, loading}}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;

interface AuthContextType {
    user: AuthenticatedUser | null,
    loading: boolean
}

interface AuthenticatedUser {
    user: User,
    additionalUserData: IAdditionalUserData
}

interface AuthContextProviderProps {
    children: ReactNode;
}