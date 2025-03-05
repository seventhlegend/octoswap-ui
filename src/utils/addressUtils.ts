/**
 * Shortens an Ethereum address for display
 * @param address - The Ethereum address to shorten
 * @param chars - Number of characters to show at start/end (default: 6 start, 4 end)
 * @returns Shortened address string
 */
export function shortenAddress(address: string, chars: number = 6): string {
  try {
    // Check if address is valid ethereum address (0x + 40 chars)
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error('Invalid Ethereum address');
    }

    // If address is shorter than expected length, return as is
    if (address.length < chars * 2 + 2) {
      return address;
    }

    // Return shortened address with ellipsis
    return `${address.slice(0, chars)}...${address.slice(-4)}`;
  } catch (error) {
    console.error('Error shortening address:', error);
    return 'Invalid address';
  }
}

/**
 * Validates if a string is a valid Ethereum address
 * @param address - The address to validate
 * @returns boolean indicating if address is valid
 */
export function isValidAddress(address: string): boolean {
  try {
    return Boolean(address.match(/^0x[a-fA-F0-9]{40}$/));
  } catch {
    return false;
  }
}
