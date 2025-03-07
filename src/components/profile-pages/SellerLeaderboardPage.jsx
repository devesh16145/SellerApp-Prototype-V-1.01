import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function SellerLeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!userId) {
          setError("User ID not found.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('profile_id', userId);

        if (error) {
          setError(error);
        } else {
          setLeaderboardData(data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [userId]);

  if (loading) {
    return <p>Loading leaderboard data...</p>;
  }

  if (error) {
    return <p>Error fetching leaderboard data: {error.message}</p>;
  }

  if (leaderboardData.length === 0) {
    return <p>No leaderboard data found for your profile.</p>;
  }

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Seller Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="justify-between">
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">SKU Count</th>
              <th className="px-4 py-2">Pricing Score</th>
              <th className="px-4 py-2">Sales Volume</th>
              <th className="px-4 py-2">Fulfillment Rate</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((seller, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{seller.rank}</td>
                <td className="px-4 py-2 text-center">{seller.sku_count}</td>
                <td className="px-4 py-2 text-center">{seller.competitive_pricing_score}</td>
                <td className="px-4 py-2 text-center">{seller.sales_volume}</td>
                <td className="px-4 py-2 text-center">{seller.order_fulfillment_rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
