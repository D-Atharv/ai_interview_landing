'use client';
import { Icons } from "@/components/icons";
import { LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function DashboardSidebar() {
    return (
        <aside className="w-64 flex flex-col border-r bg-background">
            <div className="p-6 flex items-center gap-3">
                <Icons.logo className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-bold">AssessAI</h2>
            </div>
            <nav className="flex-1 px-4 py-2 space-y-2">
                 <Button variant="ghost" className="w-full justify-start text-base">
                    <LayoutDashboard className="mr-3" />
                    Dashboard
                 </Button>
            </nav>
            <div className="p-4 border-t">
                <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/">
                        <LogOut className="mr-3" />
                        Exit Dashboard
                    </Link>
                </Button>
            </div>
        </aside>
    )
}
