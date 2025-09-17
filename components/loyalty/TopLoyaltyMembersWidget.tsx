

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { api } from '../../sdk';
import type { TopLoyaltyMember } from '../../types';
import { Skeleton } from '../ui/Skeleton';
import { NavLink } from 'react-router-dom';

const tierColorMap = {
    Platinum: 'bg-accent-100 text-accent-800',
    Gold: 'bg-primary-100 text-primary-800',
    Silver: 'bg-slate-200 text-slate-800',
    Discovery: 'bg-slate-100 text-slate-700',
};

const TopLoyaltyMembersWidget: React.FC = () => {
  const [members, setMembers] = useState<TopLoyaltyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await api.loyalty.getTopLoyaltyMembers();
        setMembers(data);
      } catch (error) {
        console.error("Failed to fetch top loyalty members:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Loyalty Members</CardTitle>
        <NavLink to="/customers" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View All &rarr;
        </NavLink>
      </CardHeader>
      <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : members.length > 0 ? (
            <ul role="list" className="-my-4 divide-y divide-slate-200">
              {members.map((member) => (
                <li key={member.id} className="py-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                          {member.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                      <p className="text-sm text-slate-500 truncate">
                          {member.points.toLocaleString()} points
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tierColorMap[member.tier]}`}>
                          {member.tier}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
                No loyalty members found.
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default TopLoyaltyMembersWidget;