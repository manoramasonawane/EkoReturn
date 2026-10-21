import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowDownLeft, ArrowUpRight, Award, Banknote, Check, Copy, ExternalLink, Gift, History, IndianRupee, Laptop, ShoppingBag, Sparkles, Store, Trees, Wallet } from 'lucide-react';
import { REWARD_OPTIONS } from '../data/mockData';
import { RewardOption, RewardTransaction, UserProfile } from '../types';
import { redeemReward } from '../utils/storage';

interface RewardsCenterProps {
  currentUser: UserProfile;
  transactions: RewardTransaction[];
}

export const RewardsCenter: React.FC<RewardsCenterProps> = ({
  currentUser,
  transactions,
}) => {
  const [selectedReward, setSelectedReward] = useState<RewardOption | null>(null);
  const [payoutInput, setPayoutInput] = useState('priya.sharma@okaxis');
  const [feedbackMsg, setFeedbackMsg] = useState<{ success: boolean; text: string; code?: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleOpenRedeem = (reward: RewardOption) => {
    setSelectedReward(reward);
    setFeedbackMsg(null);
    if (reward.category === 'cash') {
      setPayoutInput('priya.sharma@okaxis');
    } else {
      setPayoutInput(currentUser.email);
    }
  };

  const handleExecuteRedeem = () => {
    if (!selectedReward) return;

    const result = redeemReward(selectedReward, payoutInput);
    if (result.success) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      setFeedbackMsg({
        success: true,
        text: result.message,
        code: result.couponCode,
      });
    } else {
      setFeedbackMsg({
        success: false,
        text: result.message,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="py-8 bg-neutral-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Wallet Overview Banner */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                <Wallet className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                  EkoReturn Eco-Wallet
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h2 className="text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
                    {currentUser.rewardPoints}
                  </h2>
                  <span className="text-sm font-bold text-neutral-500">Available Points</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  1 Point ≈ ₹1.00 INR. Guaranteed cash payout by certified recycling partners.
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-8 text-xs">
              <div>
                <span className="text-neutral-500 block">Items Diverted</span>
                <span className="text-xl font-bold text-neutral-900 font-mono tabular-nums">
                  {currentUser.totalItemsRecycled} Units
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Total E-Waste Handed</span>
                <span className="text-xl font-bold text-neutral-900 font-mono tabular-nums">
                  {currentUser.totalWeightRecycledKg} kg
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">CO₂ Prevented</span>
                <span className="text-xl font-bold text-emerald-700 font-mono tabular-nums">
                  {currentUser.co2SavedKg} kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Options Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                Redeem Rewards & Eligible Payouts
              </span>
              <h3 className="text-lg font-bold text-neutral-900">
                Cash Transfers, Brand Vouchers & Carbon Offsets
              </h3>
            </div>
            <span className="text-xs text-neutral-500">
              No processing fees · Instant coupon delivery
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REWARD_OPTIONS.map((reward) => {
              const canAfford = currentUser.rewardPoints >= reward.pointsRequired;
              return (
                <div
                  key={reward.id}
                  className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {reward.brand}
                      </span>
                      <span className="font-mono text-sm font-extrabold text-neutral-900 tabular-nums">
                        {reward.pointsRequired} pts
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-neutral-900 mb-1">
                      {reward.title}
                    </h4>
                    <p className="text-xs text-neutral-600 line-clamp-2">
                      {reward.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-neutral-500 block">Value</span>
                      <span className="font-mono font-bold text-xs text-neutral-800">
                        ₹{reward.cashEquivalent}
                      </span>
                    </div>

                    <button
                      disabled={!canAfford}
                      onClick={() => handleOpenRedeem(reward)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95'
                          : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Redeem Now' : `Need ${reward.pointsRequired - currentUser.rewardPoints} pts`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transaction History Ledger */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-neutral-500" />
              <h3 className="text-sm font-bold text-neutral-900">
                Eco-Points & Payouts Ledger
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              {transactions.length} Activity Records
            </span>
          </div>

          <div className="divide-y divide-neutral-200">
            {transactions.map((tx) => {
              const isEarned = tx.points > 0;
              return (
                <div
                  key={tx.id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isEarned
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {isEarned ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900">
                        {tx.description}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                        <span className="font-mono">{tx.timestamp.split('T')[0]}</span>
                        <span>·</span>
                        <span>Ref: {tx.referenceId}</span>
                        {tx.couponCode && (
                          <>
                            <span>·</span>
                            <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1 rounded">
                              Code: {tx.couponCode}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-extrabold font-mono tabular-nums ${
                        isEarned ? 'text-emerald-700' : 'text-neutral-900'
                      }`}
                    >
                      {isEarned ? `+${tx.points}` : tx.points} pts
                    </span>
                    {tx.amountCurrency && (
                      <span className="text-[11px] text-neutral-500 block font-mono">
                        (₹{tx.amountCurrency})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal for Redeeming */}
        {selectedReward && (
          <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <h4 className="text-sm font-bold text-neutral-900">
                  Redeem {selectedReward.title}
                </h4>
                <button
                  onClick={() => setSelectedReward(null)}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4 text-xs">
                {feedbackMsg ? (
                  <div className="text-center py-4 space-y-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h5 className="text-sm font-bold text-neutral-900">
                      {feedbackMsg.text}
                    </h5>

                    {feedbackMsg.code && (
                      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-center">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wide block">
                          Your Unique Voucher / Payout Code
                        </span>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <span className="font-mono font-extrabold text-sm text-neutral-900">
                            {feedbackMsg.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(feedbackMsg.code!)}
                            className="p-1 hover:bg-neutral-200 rounded"
                            title="Copy Code"
                          >
                            <Copy className="w-3.5 h-3.5 text-neutral-600" />
                          </button>
                        </div>
                        {copiedCode && (
                          <span className="text-[10px] text-emerald-700 block mt-1">
                            Copied to clipboard!
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedReward(null)}
                      className="mt-3 px-5 py-2 bg-neutral-900 text-white text-xs font-bold rounded-lg"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Points Deducted:</span>
                        <span className="font-mono font-bold text-neutral-900">{selectedReward.pointsRequired} pts</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-neutral-500">Equivalent Payout Value:</span>
                        <span className="font-mono font-bold text-emerald-700">₹{selectedReward.cashEquivalent}</span>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-neutral-800 block mb-1">
                        {selectedReward.category === 'cash' ? 'UPI ID or Bank Account No.' : 'Delivery Email Address'}
                      </label>
                      <input
                        type="text"
                        value={payoutInput}
                        onChange={(e) => setPayoutInput(e.target.value)}
                        placeholder={selectedReward.category === 'cash' ? 'name@bank or 9876543210@paytm' : 'your.email@example.com'}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                      />
                      <span className="text-[10px] text-neutral-500 mt-1 block">
                        Direct transfer completed within minutes through automated banking API.
                      </span>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedReward(null)}
                        className="px-4 py-2 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 font-semibold rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleExecuteRedeem}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                      >
                        Confirm Redemption
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
