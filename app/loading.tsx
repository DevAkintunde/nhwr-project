import DashboardSkeleton, { CardSkeleton, Spinner } from "@/app/ui/utils/skeletons";
import React from "react";

export default function Loading({
	view,
	className,
}: {
	view?: "dashboard" | "card" | "cards" | "chart" | "invoice" | "invoices" | "tableRow" | "invoiceMobile" | "invoicesTable";
	className?: string;
}) {
	const output = !view ? <Spinner /> : view === "dashboard" ? <DashboardSkeleton /> : view === "card" ? <CardSkeleton /> : <Spinner />;
	return className ? <div className={className}>{output}</div> : output;
}
