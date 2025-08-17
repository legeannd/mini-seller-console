import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Lead, LeadStatus } from "@/types";
import { useAsyncAction } from "@/hooks/useAsync";
import { useLeadConversion } from "@/hooks/useLeadConversion";
import { LeadForm } from "./LeadForm";
import { ConversionPanel } from "./ConversionPanel";
import { Save, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface LeadDetailProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => Promise<void>;
}

export function LeadDetail({ lead, isOpen, onClose, onSave }: LeadDetailProps) {
  const [editedLead, setEditedLead] = useState<Lead | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { execute: executeSave, isLoading: isSaving } = useAsyncAction();
  const { hasOpportunity, handleConvert } = useLeadConversion(
    editedLead || lead
  );

  const handleSave = useCallback(async () => {
    if (!editedLead) return;

    await executeSave(async () => {
      await onSave(editedLead);
      setEditedLead(null);
    });
  }, [editedLead, onSave, executeSave]);

  const handleConvertWithLoading = useCallback(
    async (amount?: number) => {
      const leadToConvert = editedLead || lead;
      if (!leadToConvert) return;

      setIsConverting(true);
      try {
        await handleConvert(amount);
      } finally {
        setIsConverting(false);
      }
    },
    [editedLead, lead, handleConvert]
  );

  const handleLeadStatusChange = useCallback(
    (newStatus: LeadStatus) => {
      if (!lead) return;

      const currentLead = editedLead || lead;
      const updatedLead = { ...currentLead, status: newStatus };

      if (JSON.stringify(updatedLead) !== JSON.stringify(lead)) {
        setEditedLead(updatedLead);
      } else {
        setEditedLead(null);
      }
    },
    [lead, editedLead]
  );

  const handleLeadChange = useCallback(
    (updatedLead: Lead) => {
      if (!lead) return;

      if (JSON.stringify(updatedLead) !== JSON.stringify(lead)) {
        setEditedLead(updatedLead);
      } else {
        setEditedLead(null);
      }
    },
    [lead]
  );

  const handleCancel = useCallback(() => {
    setEditedLead(null);
    setHasValidationErrors(false);
    onClose();
  }, [onClose]);

  const handleValidationChange = useCallback((hasErrors: boolean) => {
    setHasValidationErrors(hasErrors);
  }, []);

  useEffect(() => {
    if (lead) {
      setEditedLead(null);
      setHasValidationErrors(false);
    }
  }, [lead]);

  if (!lead) {
    return null;
  }

  const currentLead = editedLead || lead;

  return (
    <Sheet open={isOpen} onOpenChange={handleCancel}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={
          isMobile
            ? "h-[85vh] w-full overflow-y-auto"
            : "w-[600px] sm:w-[800px] lg:w-[900px] sm:max-w-none overflow-y-auto"
        }
      >
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 pb-0">
            <SheetTitle className="text-3xl font-bold text-gray-900">
              Lead Details
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 p-6 space-y-8">
            <div className="space-y-6">
              <LeadForm
                lead={currentLead}
                onLeadChange={handleLeadChange}
                onStatusChange={handleLeadStatusChange}
                onValidationChange={handleValidationChange}
                disabled={isSaving || isConverting}
              />
            </div>

            <div className="border-t pt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Lead Conversion
                </h2>
                <p className="text-gray-600">
                  Convert this lead into a sales opportunity to track potential
                  revenue.
                </p>
              </div>

              <ConversionPanel
                lead={currentLead}
                hasOpportunity={hasOpportunity}
                isConverting={isConverting}
                onConvert={handleConvertWithLoading}
                onClose={handleCancel}
              />
            </div>
          </div>

          <div className="sticky bottom-0 border-t p-6 bg-gray-50 mt-auto">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving || isConverting}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  !editedLead || hasValidationErrors || isSaving || isConverting
                }
                className="min-w-[120px] flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
