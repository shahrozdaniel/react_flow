import { useCallback,useContext } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { motion } from "framer-motion";
import { AutomationContext } from "@/app/ui/automationFlow/context";
const handleStyle = { left: 10 };

export function TriggerButton(props: NodeProps) {
  //   const onChange = useCallback((evt) => {
  //     console.log(evt.target.value);
  //   }, []);

  const {setAutomationState} = useContext(AutomationContext);


  const onTriggerClick = () => {
    setAutomationState((prev:any) => {
      return {
        ...prev,
        isSidebarOpen: true,
        clickedNodeId: "0",
        showNodeType: "triggerNode",
      }
    })  
  }

  return (
    <div
      className="add-trigger-node flex items-center flex-col justify-center"
      onClick={() => onTriggerClick()}
    >
      <div className="flex w-16 h-16 items-center justify-center cursor-pointer">
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
          
        </motion.div>
        <AddCircleIcon className="text-blue-600 absolute" />
      </div>
      <div className="flex-grow-1 ms-3">
        <div className="fw-bold handfree font-15 mb-1 font-cursive w-44">
          {" "}
          Click here to add a new starting trigger{" "}
        </div>
      </div>
    </div>
  );
}
