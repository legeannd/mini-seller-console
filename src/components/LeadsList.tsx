import { memo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import type { Lead, Opportunity } from "@/types";
import { cn } from "@/lib/utils";
import { TrendingUp, User, Building2, Mail } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface LeadsListProps {
  leads: Lead[];
  opportunities: Opportunity[];
  isLoading: boolean;
  onLeadClick: (lead: Lead) => void;
}

function StatusBadge({ status }: { status: Lead["status"] }) {
  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "Contacted":
        return "bg-yellow-100 text-yellow-800";
      case "Qualified":
        return "bg-purple-100 text-purple-800";
      case "Converted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
}

function LoadingRow() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading leads...</span>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface MobileLeadCardProps {
  lead: Lead;
  opportunities: Opportunity[];
  onClick?: () => void;
}

function MobileLeadCard({ lead, opportunities, onClick }: MobileLeadCardProps) {
  const hasOpportunity = opportunities.some((opp) => opp.leadId === lead.id);
  const isConverted = lead.status === "Converted";

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border",
        isConverted &&
          "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
      )}
      onClick={onClick}
    >
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {lead.name}
              </h3>
              {hasOpportunity && (
                <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
              <Building2 className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{lead.company}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{lead.email}</span>
            </div>
          </div>
          <StatusBadge status={lead.status} />
        </div>
        <div className="flex items-center justify-between text-xs mt-2">
          <span className="text-gray-500">Score: {lead.score}</span>
          <span className="text-gray-500 capitalize">{lead.source}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell
        colSpan={6}
        className="text-center py-12 text-muted-foreground"
      >
        No leads found. Try adjusting your search or filter criteria.
      </TableCell>
    </TableRow>
  );
}

function LeadsListComponent({
  leads,
  opportunities,
  isLoading,
  onLeadClick,
}: LeadsListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const hasOpportunity = (leadId: string) => {
    return opportunities.some((opp) => opp.leadId === leadId);
  };

  const rowVirtualizer = useVirtualizer({
    count: isLoading ? 1 : leads.length === 0 ? 1 : leads.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isMobile ? 170 : 56),
    overscan: 5,
  });

  if (isMobile) {
    return (
      <div className="space-y-0">
        <div
          ref={parentRef}
          className="h-[400px] overflow-auto px-4"
          style={{
            contain: "strict",
          }}
        >
          <div
            style={{
              height:
                isLoading || leads.length === 0
                  ? "100%"
                  : `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading leads...</span>
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No leads found. Try adjusting your search or filter criteria.
              </div>
            ) : (
              rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const lead = leads[virtualItem.index];
                return (
                  <div
                    key={virtualItem.key}
                    data-index={virtualItem.index}
                    ref={rowVirtualizer.measureElement}
                    className="absolute left-0 top-0 w-full"
                    style={{
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <MobileLeadCard
                      lead={lead}
                      opportunities={opportunities}
                      onClick={() => onLeadClick(lead)}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="sticky top-0 bg-background z-10 border-b pr-[15px]">
        <Table>
          <TableHeader>
            <TableRow className="grid grid-cols-6 items-center gap-2 justify-start min-h-12">
              <TableHead className="flex items-center justify-start">
                Name
              </TableHead>
              <TableHead className="flex items-center justify-start">
                Company
              </TableHead>
              <TableHead className="flex items-center justify-start">
                Email
              </TableHead>
              <TableHead className="flex items-center justify-start">
                Source
              </TableHead>
              <TableHead className="flex items-center justify-start">
                Score
              </TableHead>
              <TableHead className="flex items-center justify-start">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      <div
        ref={parentRef}
        className="h-[600px] overflow-auto"
        style={{
          contain: "strict",
        }}
      >
        <Table
          style={{
            height:
              isLoading || leads.length === 0
                ? "100%"
                : `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          <TableBody>
            {isLoading ? (
              <LoadingRow />
            ) : leads.length === 0 ? (
              <EmptyState />
            ) : (
              rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const lead = leads[virtualItem.index];
                return (
                  <TableRow
                    key={virtualItem.key}
                    data-index={virtualItem.index}
                    ref={rowVirtualizer.measureElement}
                    className={cn(
                      "grid grid-cols-6 items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors absolute left-0 top-0 w-full",
                      lead.status === "Converted" &&
                        "bg-green-50 hover:bg-green-100"
                    )}
                    style={{
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    onClick={() => onLeadClick(lead)}
                  >
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell className="font-semibold">
                      {lead.score}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={lead.status} />
                        {hasOpportunity(lead.id) && (
                          <div title="Has associated opportunity">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const LeadsList = memo(LeadsListComponent);
