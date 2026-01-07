import { Button } from "@/components/ui/button"
import TransactionList from "@/components/transactions/TransactionList"
import { Link } from "react-router-dom"
import { FAB } from "@/components/ui/FAB"
import { ChevronRight } from "lucide-react"

export default function DashboardPage() {

    return (
        <>
            <div className="my-4 px-4">
                <div className="flex justify-between items-center mb-1 mx-2">
                    <span className="font-medium text-norway-950">Dernières transactions</span>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/transactions" className="text-gray-500">
                                <span className="font-bold">Voir plus</span>
                                <ChevronRight className="mt-0.5" />
                            </Link>
                        </Button>
                </div>
                <TransactionList variant={"mobile"} limit={5} />
            </div>
            <FAB />
        </>
    )
}