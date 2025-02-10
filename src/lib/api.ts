"use client";
import axiosInstance from "./axios";
import { getGatewayID } from "./utils";

export const fetchWhatsAppTemplates = async () => {
  const response = await axiosInstance.post("whatsapp/fetch-queue-template", {
    queueID: getGatewayID(),
  });
  if (
    response.status === 200 &&
    response.data.status_code === 200 &&
    response.data.data.length > 0
  ) {
    return response.data.data;
  } else {
    return [];
  }
};
export const fetchButtonByTemplateId = async (templateId: string) => {
  console.log("fetchButtonByTemplateId ---- ", templateId);
  const response = await axiosInstance.post("whatsapp/fetch-template-buttons", {
    queueID: getGatewayID(),
    whatsappTemplateID: templateId,
  });
  console.log("fetchButtonByTemplateId response", response);
  if (
    response.status === 200 &&
    response.data.status_code === 200 &&
    response.data.data.length > 0
  ) {
    return response.data.data;
  } else {
    return [];
  }
};

export const fetchDNCList = async () => {
  return await fetchDNCOrContactSelectionList("dnc-list");
};
export const fetchContactList = async () => {
  return await fetchDNCOrContactSelectionList("contact-list");
};

export const fetchSelectionList = async (selectionList: string) => {
  return await fetchDNCOrContactSelectionList("selection-list", selectionList);
};

export const fetchPublishedFlowById = async (flowId: number) => {
  const queueID = getGatewayID();
  return await axiosInstance.get(
    `whatsapp/fetchActionFlow/${queueID}/${flowId}`
  );
};

export const saveDraftedFlow = async (flow: any) => {
  const queueID = getGatewayID();
  return await axiosInstance.post(
    `whatsapp/getResponse/${queueID}/drafted`,
    flow
  );
};

async function fetchDNCOrContactSelectionList(
  query: string,
  selectionList: string | null = null
) {
  const postData: any = {
    queueID: getGatewayID(),
    Query: query,
  };
  if (selectionList) {
    postData["contact-list"] = selectionList;
  }
  const response = await axiosInstance.post(
    "whatsapp/fetch-contact-lists",
    postData
  );
  console.log("fetchDNCOrContactSelectionList response", response);
  if (
    response.status === 200 &&
    response.data.status_code === 200 &&
    response.data.data.length > 0
  ) {
    return response.data.data;
  } else {
    return [];
  }
}
