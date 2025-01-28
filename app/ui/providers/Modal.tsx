"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";

// Provider available in ClientEntry Module
export const Modal = createContext<{
	modal: { element: React.ReactNode; className?: string } | void;
	setModal: React.Dispatch<React.SetStateAction<{ element: React.ReactNode; className?: string } | void>>;
}>({
	modal: undefined,
	setModal: () => undefined,
});

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
	//Contents that goes in Modal pop-up
	const [modal, setModal] = useState<{ element: React.ReactNode; className?: string } | void>();
	const thisModalContent = useMemo(() => ({ modal, setModal }), [modal]);

	return <Modal.Provider value={thisModalContent}>{children}</Modal.Provider>;
};

const ModalRegion = () => {
	const { modal } = useContext(Modal);
	//console.log("modal: ", modal);

	return modal && modal.element
		? createPortal(
				<div className="absolute top-0 bottom-0 left-0 right-0">
					<div
						id="modal"
						className={
							(!modal.className ||
							(modal.className &&
								!modal.className.includes("sticky") &&
								!modal.className.includes("fixed") &&
								!modal.className.includes("absolute") &&
								!modal.className.includes("relative"))
								? "sticky z-[999] "
								: "z-[999] ") +
							"h-screen m-0 overflow-y-auto " +
							(!modal.className ? "bg-[#5B72EE]/[0.15] text-color-link z-50" : modal.className) +
							(!modal.className || (modal.className && !modal.className.includes("top-")) ? " top-0" : "") +
							(!modal.className || (modal.className && !modal.className.includes("bottom-")) ? " bottom-0" : "") +
							(!modal.className || (modal.className && !modal.className.includes("left-")) ? " left-0" : "") +
							(!modal.className || (modal.className && !modal.className.includes("right-")) ? " right-0" : "")
						}
					>
						{modal.element}
					</div>
				</div>,
				document.getElementById("quizmaster-app")!
		  )
		: null;
};

export default ModalRegion;
