"use client";

import { useMemo, useState } from "react";
import { AdminPanelSection } from "@/components/admin/admin-ui";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import type { DashboardPanel } from "@/components/dashboard/dashboard-sidebar";
import {
  DashboardDonationHistory,
  type DashboardDonationItem,
} from "@/components/dashboard-donation-history";
import { DashboardProfileSection } from "@/components/dashboard-profile-section";
import { DashboardWarmWishes } from "@/components/dashboard-warm-wishes";
import { CommunityPostsPanel } from "@/components/community-posts-panel";
import { MemberDonationRequestForm } from "@/components/member-donation-request-form";
import type { WarmWishItem } from "@/components/warm-wishes-grid";
import type { CommunityPostItem } from "@/components/community-posts-types";

type DashboardWorkspaceProps = {
  user: {
    id: number;
    name: string;
    email: string;
    profileImage: string | null;
    major: string | null;
  };
  donations: DashboardDonationItem[];
  warmWishes: WarmWishItem[];
  communityPosts: CommunityPostItem[];
};

export function DashboardWorkspace({ user, donations, warmWishes, communityPosts }: DashboardWorkspaceProps) {
  const [activePanel, setActivePanel] = useState<DashboardPanel>("overview");

  const approvedDonations = useMemo(
    () => donations.filter((donation) => donation.status === "APPROVED"),
    [donations],
  );
  const pendingDonations = useMemo(
    () => donations.filter((donation) => donation.status === "PENDING"),
    [donations],
  );

  const total = approvedDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const donationCount = approvedDonations.length;
  const average = donationCount > 0 ? total / donationCount : 0;
  const trendData = approvedDonations.slice(0, 7).reverse();
  const trendMax = Math.max(...trendData.map((d) => d.amount), 1);

  return (
    <DashboardLayout
      userName={user.name}
      userEmail={user.email}
      profileImage={user.profileImage}
      activePanel={activePanel}
      onPanelChange={setActivePanel}
      pendingDonationCount={pendingDonations.length}
    >
      <AdminPanelSection show={activePanel === "overview"}>
        <DashboardOverview
          total={total}
          donationCount={donationCount}
          average={average}
          pendingCount={pendingDonations.length}
          trendData={trendData}
          trendMax={trendMax}
          recentDonations={donations}
          onNavigate={setActivePanel}
        />
      </AdminPanelSection>

      <AdminPanelSection show={activePanel === "donate"}>
        <MemberDonationRequestForm embedded />
      </AdminPanelSection>

      <AdminPanelSection show={activePanel === "history"}>
        <DashboardDonationHistory
          donations={donations}
          userName={user.name}
          userEmail={user.email}
          embedded
        />
      </AdminPanelSection>

      <AdminPanelSection show={activePanel === "profile"}>
        <DashboardProfileSection
          key={`${user.id}:${user.name}:${user.major ?? ""}:${user.profileImage ?? ""}`}
          initialName={user.name}
          initialEmail={user.email}
          initialMajor={user.major}
          initialProfileImage={user.profileImage}
          embedded
        />
      </AdminPanelSection>

      <AdminPanelSection show={activePanel === "cheerWall"}>
        <DashboardWarmWishes
          key={warmWishes.map((w) => `${w.id}:${w.message}`).join("|") || "empty"}
          initialWishes={warmWishes}
          currentUserId={user.id}
          embedded
        />
      </AdminPanelSection>

      <AdminPanelSection show={activePanel === "posts"}>
        <CommunityPostsPanel
          key={communityPosts.map((p) => `${p.id}:${p.updatedAt}`).join("|") || "empty"}
          initialPosts={communityPosts}
          currentUser={{
            id: user.id,
            name: user.name,
            profileImage: user.profileImage,
            role: "MEMBER",
          }}
          embedded
          ownPostsOnly
          title="Share a post"
          description="Write updates with text and photos. Your posts appear on the public home page for everyone to see."
        />
      </AdminPanelSection>
    </DashboardLayout>
  );
}
