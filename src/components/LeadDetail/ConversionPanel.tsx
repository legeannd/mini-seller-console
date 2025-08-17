import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Lead } from "@/types";
import { validateAmount } from "@/utils/validation";
import { parseCurrency, formatCurrency } from "@/utils/currency";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface ConversionPanelProps {
  lead: Lead;
  hasOpportunity: boolean;
  isConverting?: boolean;
  onConvert: (amount?: number) => Promise<void>;
  onClose: () => void;
}

export function ConversionPanel({
  lead,
  hasOpportunity,
  isConverting = false,
  onConvert,
  onClose,
}: ConversionPanelProps) {
  const [conversionAmount, setConversionAmount] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);

  const handleConvert = useCallback(async () => {
    const amountValidationError = validateAmount(conversionAmount);
    if (amountValidationError) {
      setAmountError(amountValidationError);
      return;
    }

    const amount = conversionAmount
      ? parseCurrency(conversionAmount)
      : undefined;
    await onConvert(amount || undefined);
    onClose();
  }, [conversionAmount, onConvert, onClose]);

  const handleAmountChange = useCallback(
    (value: string) => {
      setConversionAmount(value);
      if (amountError) {
        setAmountError(null);
      }
    },
    [amountError]
  );

  if (hasOpportunity || lead.status === "Converted") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="h-5 w-5" />
            Lead Already Converted
          </CardTitle>
          <CardDescription className="text-green-700">
            This lead has already been converted to an opportunity.{" "}
            {hasOpportunity
              ? "Check the opportunities list to view details."
              : "The conversion process was done externally."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (lead.status !== "Qualified") {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5" />
            Conversion Requirements
          </CardTitle>
          <CardDescription className="text-amber-700">
            Lead must be "Qualified" before conversion to opportunity. Current
            status: {lead.status}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Convert to Opportunity
        </CardTitle>
        <CardDescription>
          Convert this qualified lead into a sales opportunity with potential
          revenue.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Expected Deal Value (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g. 25000 or $25,000"
            value={conversionAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            disabled={isConverting}
            className={amountError ? "border-red-500" : ""}
          />
          {amountError && (
            <p className="mt-1 text-sm text-red-600">{amountError}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Leave empty if deal value is unknown or to be determined
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Conversion Summary</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Lead status will change to "Converted"</li>
            <li>• New opportunity will be created</li>
            <li>• Lead data will be copied to opportunity</li>
            {conversionAmount && (
              <li>
                • Deal value:{" "}
                {formatCurrency(parseCurrency(conversionAmount) || 0)}
              </li>
            )}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isConverting}>
          Cancel
        </Button>
        <Button
          onClick={handleConvert}
          disabled={isConverting}
          className="min-w-[120px]"
        >
          {isConverting ? "Converting..." : "Convert Lead"}
        </Button>
      </CardFooter>
    </Card>
  );
}
