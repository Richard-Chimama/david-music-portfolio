"use client";
import { useState } from "react";
import { Button } from "./Button";

interface PurchaseButtonProps {
  trackId: number;
  title: string;
  src: string;
  format: string;
  sizeInMB: number;
  price: string;
  className?: string;
  onPurchaseStart?: () => void;
}

export function PurchaseButton({ 
  trackId, 
  title, 
  src,
  format, 
  sizeInMB, 
  price, 
  className = "",
  onPurchaseStart 
}: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    onPurchaseStart?.();
    
    try {
      // TODO: Implement checkout API call
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          trackId,
          title,
          src,
          // Parse price like "€2" -> 200 cents; fallback to €2
          amount: (() => {
            const numeric = parseFloat(String(price).replace(/[^0-9.,-]/g, '').replace(',', '.'));
            if (!isNaN(numeric) && numeric > 0) return Math.round(numeric * 100);
            return 200;
          })(),
          currency: 'eur'
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url; // Redirect to Stripe Checkout
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      // TODO: Show error toast/notification
      alert('Failed to start purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-medium text-lg mb-1">Download Full Track</h4>
          <p className="text-sm text-[var(--foreground)]/70">{title}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[var(--neon-cyan)]">{price}</div>
        </div>
      </div>

      {/* File Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-[var(--background)]/50 rounded-lg border border-[var(--border)]">
        <div>
          <div className="text-xs text-[var(--foreground)]/70 uppercase tracking-wide">Format</div>
          <div className="font-medium">{format}</div>
        </div>
        <div>
          <div className="text-xs text-[var(--foreground)]/70 uppercase tracking-wide">Size</div>
          <div className="font-medium">{sizeInMB.toFixed(1)} MB</div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--neon-cyan)]">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            High-quality audio file
          </li>
          <li className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--neon-cyan)]">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Instant download after payment
          </li>
          <li className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--neon-cyan)]">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Email receipt with download link
          </li>
        </ul>
      </div>

      {/* Purchase Button */}
      <Button 
        onClick={handlePurchase}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] hover:from-[var(--neon-cyan)]/80 hover:to-[var(--neon-purple)]/80 text-black font-medium"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Purchase & Download
          </>
        )}
      </Button>

      {/* Security Notice */}
      <div className="mt-4 text-xs text-[var(--foreground)]/60 text-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1">
          <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4A2,2 0 0,0 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10A2,2 0 0,0 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
        </svg>
        Secure payment powered by Stripe
      </div>
    </div>
  );
}