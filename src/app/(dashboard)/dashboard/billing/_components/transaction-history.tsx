"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactions } from "@/actions/credits.action";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table";
import { format, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useTransactionStore } from "@/state/transaction";
import { ColumnDef } from "@tanstack/react-table";

type TransactionData = Awaited<ReturnType<typeof getTransactions>>;
type Transaction = TransactionData["transactions"][number];

function isTransactionExpired(transaction: Transaction): boolean {
  return transaction.expirationDate
    ? isPast(new Date(transaction.expirationDate))
    : false;
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("createdAt")), "MMM d, yyyy");
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <span className="capitalize">
          {type.toLowerCase().replace("_", " ")}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <span
          className={
            transaction.type === "USAGE"
              ? "text-red-500"
              : isTransactionExpired(transaction)
                ? "text-orange-500"
                : "text-green-500"
          }
        >
          {transaction.type === "USAGE" ? "-" : "+"}
          {Math.abs(transaction.amount)}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div>
          {transaction.description}
          {transaction.type !== "USAGE" && transaction.expirationDate && (
            <Badge
              variant="secondary"
              className={`mt-1 ml-3 font-normal text-[0.75rem] leading-4 ${
                isTransactionExpired(transaction)
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-muted"
              }`}
            >
              {isTransactionExpired(transaction) ? "Expired: " : "Expires: "}
              {format(new Date(transaction.expirationDate), "MMM d, yyyy")}
            </Badge>
          )}
        </div>
      );
    },
  },
];

export function TransactionHistory() {
  const [data, setData] = useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const refreshTrigger = useTransactionStore((state) => state.refreshTrigger);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const result = await getTransactions({ page });
        setData(result);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [page, refreshTrigger]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data?.transactions || []}
          pageCount={data?.pagination.pages || 1}
          pageIndex={page - 1}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={setPageSize}
          totalCount={data?.pagination.total || 0}
          itemNameSingular="transaction"
          itemNamePlural="transactions"
        />
      </CardContent>
    </Card>
  );
}
