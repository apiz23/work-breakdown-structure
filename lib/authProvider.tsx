"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { validateLogin } from "@/app/service/wbsService";

type User = {
	username: string;
	role: string;
};

type AuthContextType = {
	user: User | null;
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	useEffect(() => {
		const storedUserName = sessionStorage.getItem("userName");
		const storedRole = sessionStorage.getItem("role");

		if (storedUserName && storedRole) {
			setUser({ username: storedUserName, role: storedRole });
		}
	}, []);

	const login = async (username: string, password: string): Promise<void> => {
		const result = await validateLogin(username, password);
		if (result.valid) {
			sessionStorage.setItem("login", "authorized");
			sessionStorage.setItem("userName", result.userName as string);
			sessionStorage.setItem("role", result.role as string);

			setUser({
				username: result.userName as string,
				role: result.role as string,
			});
			router.push(result.role === "admin" ? "/admin" : "/client");
		} else {
			throw new Error(result.message);
		}
	};

	const logout = () => {
		sessionStorage.removeItem("login");
		sessionStorage.removeItem("userName");
		sessionStorage.removeItem("role");

		setUser(null);
		router.push("/");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
