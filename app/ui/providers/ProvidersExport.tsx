"use client";
import { createContext, useEffect, useMemo, useState } from "react";
import { ModalProvider } from "./Modal";
import { ACCOUNT } from "@/app/lib/@types";

export const Account = createContext<{
	account?: ACCOUNT;
	setAccount: React.Dispatch<React.SetStateAction<ACCOUNT | undefined>>;
}>({
	account: undefined,
	setAccount: () => undefined,
});
export const InternetConnectionStatus = createContext<{
	connected: boolean | undefined;
	setConnection: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}>({
	connected: false,
	setConnection: () => undefined,
});

const Providers = ({ children, profile }: { children: React.ReactNode; profile?: ACCOUNT }) => {
	const [account, setAccount] = useState<ACCOUNT>();
	const thisUserAccount = useMemo(() => ({ account, setAccount }), [account]);

	useEffect(() => {
		let isMounted = true;
		if (isMounted && profile) setAccount(profile);

		return () => {
			isMounted = false;
		};
	}, [profile]);

	const [connected, setConnection] = useState<boolean | undefined>();
	const thisConnection = useMemo(() => ({ connected, setConnection }), [connected]);
	useEffect(() => {
		let isMounted = true;
		//check if there's internet connect on App Load
		if (window) {
			if (window.navigator.onLine && isMounted) setConnection(true);
			//Listen for internet status changes
			window.addEventListener("online", () => {
				if (isMounted) setConnection(true);
			});
			window.addEventListener("offline", () => {
				if (isMounted) setConnection(false);
			});
		}
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<InternetConnectionStatus.Provider value={thisConnection}>
			<Account.Provider value={thisUserAccount}>
				<ModalProvider>{children}</ModalProvider>
			</Account.Provider>
		</InternetConnectionStatus.Provider>
	);
};

export default Providers;
