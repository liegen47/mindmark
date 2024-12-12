import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <main suppressHydrationWarning>{children}</main>;
};

export default DashboardLayout;
