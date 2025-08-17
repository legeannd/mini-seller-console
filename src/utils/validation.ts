export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return 'Email is required';
  }

  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }

  return null;
}

export function validateAmount(amount: string): string | null {
  if (!amount.trim()) {
    return null;
  }

  const numericRegex = /^\d+(\.\d{1,2})?$/;
  if (!numericRegex.test(amount)) {
    return 'Amount must be a valid number (e.g., 1000 or 1000.50)';
  }

  const numericValue = parseFloat(amount);
  if (numericValue <= 0) {
    return 'Amount must be greater than 0';
  }

  if (numericValue > 10000000) {
    return 'Amount cannot exceed $10,000,000';
  }

  return null;
}
