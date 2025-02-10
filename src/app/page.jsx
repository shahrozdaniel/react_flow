"use client";
import { useEffect, useState } from "react";
import AutomationFlowWithProvider from "@/app/ui/automationFlow";

export default function Home() {
  const [gatewayID, setGatewayID] = useState(0);
  const [actionFlowID, setActionFlowID] = useState(0);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    setTimeout(() => {
      if (window.gatewayID && window.apiUrl) {
        setGatewayID(window.gatewayID || 0);
        setActionFlowID(window.actionFlowID || 0);
        setApiUrl(window.apiUrl);
        console.log(
          "props from div >>>>>>>  ",
          window.gatewayID,
          window.actionFlowID,
          window.apiUrl
        );
      } else {
        console.log("props not found <<<<<<<<<<<<  ");
      }
    }, 100);
  }, []);

  return (
    <main className="flex flex-col items-center justify-between">
      <div className="w-full items-center justify-between font-mono text-sm lg:flex">
        <AutomationFlowWithProvider
          gatewayID={gatewayID}
          actionFlowID={actionFlowID}
          apiUrl={apiUrl}
        />
      </div>
    </main>
  );
}
