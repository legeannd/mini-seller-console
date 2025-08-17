import { memo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Opportunity } from "@/types";
import { formatCurrency } from "@/utils/currency";

interface OpportunitiesListProps {
  opportunities: Opportunity[];
}

const OpportunityRow = memo(
  ({
    opportunity,
    virtualized = false,
  }: {
    opportunity: Opportunity;
    virtualized?: boolean;
  }) => {
    return (
      <TableRow
        className={cn(
          "grid grid-cols-4 items-center gap-2 cursor-default",
          virtualized && "absolute left-0 top-0 w-full"
        )}
      >
        <TableCell className="font-medium">{opportunity.name}</TableCell>
        <TableCell>{opportunity.company}</TableCell>
        <TableCell>
          {opportunity.amount ? formatCurrency(opportunity.amount) : "-"}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {new Date(opportunity.createdAt).toLocaleDateString()}
        </TableCell>
      </TableRow>
    );
  }
);

OpportunityRow.displayName = "OpportunityRow";

function EmptyState() {
  return (
    <TableRow className="grid grid-cols-4 items-center gap-2">
      <TableCell
        colSpan={4}
        className="text-center py-8 text-muted-foreground col-span-4"
      >
        No opportunities yet. Convert some leads to get started!
      </TableCell>
    </TableRow>
  );
}

function OpportunitiesListComponent({ opportunities }: OpportunitiesListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const shouldVirtualize = opportunities.length > 10;

  const rowVirtualizer = useVirtualizer({
    count: opportunities.length === 0 ? 1 : opportunities.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  if (!shouldVirtualize) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="grid grid-cols-4 items-center gap-2 justify-start min-h-12">
              <TableHead className="flex items-center justify-start">
                Name
              </TableHead>
              <TableHead className="flex items-center justify-start">
                Company
              </TableHead>
              <TableHead className="flex items-center justify-start">
                Amount
              </TableHead>
              <TableHead className="flex items-center justify-start">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.length === 0 ? (
              <EmptyState />
            ) : (
              opportunities.map((opportunity) => (
                <OpportunityRow
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="sticky top-0 bg-background z-10 border-b pr-[15px]">
        <Table>
          <TableHeader>
            <TableRow className="grid grid-cols-4 items-center gap-2 justify-start min-h-12">
              <TableHead className="flex items-center justify-start">
                Name
              </TableHead>
              <TableHead className="flex items-center justify-start">
                Company
              </TableHead>
              <TableHead className="flex items-center justify-start">
                Amount
              </TableHead>
              <TableHead className="flex items-center justify-start">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      <div
        ref={parentRef}
        className="h-[400px] overflow-auto"
        style={{
          contain: "strict",
        }}
      >
        <Table
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          <TableBody>
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const opportunity = opportunities[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                  }}
                >
                  <OpportunityRow opportunity={opportunity} virtualized />
                </div>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const OpportunitiesList = memo(OpportunitiesListComponent);
