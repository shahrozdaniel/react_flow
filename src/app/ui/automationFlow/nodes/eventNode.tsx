"use client";
import { useCallback, useContext } from "react";
import {
  getOutgoers,
  Handle,
  Position,
  useReactFlow,
  Node,
} from "@xyflow/react";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LabelIcon from "@mui/icons-material/Label";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { motion } from "framer-motion";
import {
  AutomationContext,
  sidebarContext,
} from "@/app/ui/automationFlow/context";
import EventIcons from "@/app/ui/automationFlow/eventIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useReactFlowNode } from "@/lib/hooks/useReactFlowNode";

const handleStyle = { bottom: -5 };
const TrigerClasses = "w-56 max-w-56 flex flex-row relative";

const labelNodes = ["incommingText", "incommingContact", "incommingStatus"];

const labelWhatsappNodes = ["incomingButton", "incommingTextOrButton"];

const eventMap = {
  runNowOrSchedule: "Run Now Or Schedule Campaign",
  incommingText: "Incomming Text",
  incommingContact: "Incomming Contact",
  incommingStatus: "Incomming Status",
  incomingButton: "Incoming Button",
  incommingTextOrButton: "Incomming Text Or Button",
};
const subdataClasses = "text-[11px] text-muted-foreground";

export function EventNode(props: any) {
  const { id, data, isConnectable } = props;

  const { setAutomationState } = useContext(AutomationContext);
  const { sidebarState, setSidebarState, setSidebarState2 } =
    useContext(sidebarContext);

  const { deleteNode } = useReactFlowNode();
  const { getEdges, getNodes, deleteElements } = useReactFlow();
  const outgoers = getOutgoers({ id } as Node, getNodes(), getEdges());
  const showDropDownMenu = outgoers.length === 0;

  const handleAddNode = (id: string) => {
    console.log(" handleAddNode data : ", data);
    setAutomationState((prev: any) => {
      return {
        ...prev,
        isSidebarOpen: true,
        clickedNodeId: id,
        showNodeType: "nextActionNode",
        nodeInnerNextActionType: null,
        previousSubActionType: data?.actionType,
        editNode: false,
      };
    });
  };
  const handleEditNode = () => {
    console.log(" handleEditNode data : ", data);
    setAutomationState((prev: any) => {
      return {
        ...prev,
        isSidebarOpen: true,
        clickedNodeId: id,
        //editNodeId: id,
        showNodeType:data.nodeType,
        editNode: true,
        editNodeData: data,
        nodeInnerNextActionType: data.actionType,
      };
    });
  };
  const handleDeleteNode = () => {
    deleteNode(id);
  };
  
  return (
    <div className={TrigerClasses}>
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        isConnectable={isConnectable}
      />

      <div
        className="flex grow gap-2 justify-center items-center border-2 border-slate-200 rounded-md bg-white p-2 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 hover:duration-500 hover:shadow-md"
        //onClick={() => handleEditNode()}
      >
        <div className="shrink-0">
          {data.actionType && <EventIcons type={data.actionType} fontsize={16}/>}
        </div>
        <div className="flex flex-row grow">
          <div className="grow">
            <div className="w-40 text-[13px] truncate ...">{data.label}</div>
            {/* <LabelIcon className='w-5 bg-slate-100 p-1 rounded'/> */}
            {data.formData.text && (
              <p className={subdataClasses}> <EventIcons type={"text"} fontsize={12} />{" "}{data.formData.text}</p>
            )}
            {data.formData.status && (
              <p className={subdataClasses}> <EventIcons type={"status"} fontsize={12} />{" "}{data.formData.status}</p>
            )}
            {data.formData.whatsappTemplateLabel && (
              <p className="text-[11px] text-muted-foreground w-40 truncate ...">
                <EventIcons type={"template"} fontsize={12} />{" "}
                {data.formData.whatsappTemplateLabel}
              </p>
            )}

            {(data.actionType === "incommingTextOrButton" || data.actionType === "incomingButton") && (<p className={subdataClasses}>
                <EventIcons type={"click"} fontsize={12} />{" "}
                {data.formData.selectedButton}
              </p>)}
            {data.actionType === "runNowOrSchedule" && (
              <>
                <p className={subdataClasses}>
                  {" "}
                  <EventIcons type={"incommingContact"} fontsize={12} />{" "}
                  {data.formData.contactListName}
                </p>
                <p className={subdataClasses}>
                  {" "}
                  <EventIcons type={"template"} fontsize={12} />{" "}
                  {data.formData.templateName}
                </p>
                {data.formData.recurring ? 
                  <p className={subdataClasses}>
                    {" "}
                    <EventIcons type={"recurring"} fontsize={12} />{" "}
                    {data.formData.frequency}
                  </p>
                : <p className={subdataClasses}>
                {" "}
                <EventIcons type={"sechedule"} fontsize={12}/>{" "}
                {data.formData.schedule ? data.formData.schedule.toLocaleString('en-GB',{hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'}) : ""}
              </p>}
              </>
            )}
          </div>
          {showDropDownMenu && (
            <div className="shrink-0 cursor-pointer -mt-1 -mr-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <MoreVertIcon sx={{ fontSize: 16 }} className="text-blue-600" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={handleEditNode}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteNode}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
        style={handleStyle}
        className="!bg-transparent !border-none !cursor-pointer relative"
      >
        <motion.div
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.4, x: -2, y: -2 }}
          onClick={() => {
            handleAddNode(id);
          }}
        >
          <AddCircleIcon className="text-blue-600 absolute -left-2" />
        </motion.div>
      </Handle>
    </div>
  );
}
