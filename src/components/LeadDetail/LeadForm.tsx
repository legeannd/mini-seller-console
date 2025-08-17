import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lead, LeadStatus } from "@/types";
import { validateEmail } from "@/utils/validation";
import { toast } from "sonner";
import { User, Mail, Building2, TrendingUp } from "lucide-react";

interface LeadFormProps {
  lead: Lead;
  onLeadChange: (lead: Lead) => void;
  onStatusChange: (status: LeadStatus) => void;
  onValidationChange: (hasErrors: boolean) => void;
  disabled?: boolean;
}

export function LeadForm({
  lead,
  onLeadChange,
  onStatusChange,
  onValidationChange,
  disabled = false,
}: LeadFormProps) {
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    onValidationChange(!!emailError);
  }, [emailError, onValidationChange]);

  const handleEmailBlur = useCallback(() => {
    const error = validateEmail(lead.email);
    if (error) {
      setEmailError(error);
      toast.error("Invalid email format");
    }
  }, [lead.email]);

  const handleFieldChange = useCallback(
    (field: keyof Lead, value: string) => {
      const updatedLead = { ...lead, [field]: value };
      onLeadChange(updatedLead);

      if (field === "email") setEmailError(null);
    },
    [lead, onLeadChange]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              value={lead.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              disabled={disabled}
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email Address
            </label>
            <Input
              type="email"
              value={lead.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              onBlur={handleEmailBlur}
              disabled={disabled}
              placeholder="Enter email address"
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <Input
              value={lead.company}
              onChange={(e) => handleFieldChange("company", e.target.value)}
              disabled={disabled}
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Source
            </label>
            <Input
              value={lead.source}
              onChange={(e) => handleFieldChange("source", e.target.value)}
              disabled={disabled}
              placeholder="e.g. Website, Referral, Cold Call"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Lead Metrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Score
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              value={lead.score}
              onChange={(e) => handleFieldChange("score", e.target.value)}
              disabled={disabled}
              placeholder="0-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={lead.status}
              onValueChange={onStatusChange}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
