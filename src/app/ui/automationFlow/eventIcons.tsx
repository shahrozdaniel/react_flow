"use client";

import AlarmIcon from "@mui/icons-material/Alarm";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import ContactsIcon from "@mui/icons-material/Contacts";
import HelpIcon from "@mui/icons-material/Help";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import ReplyIcon from "@mui/icons-material/Reply";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import SendIcon from "@mui/icons-material/Send";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import TimerIcon from '@mui/icons-material/Timer';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DoNotDisturbOffIcon from '@mui/icons-material/DoNotDisturbOff';
import MessageIcon from '@mui/icons-material/Message';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';

export default function EventIcons({ type, fontsize=24 }: { type: string, fontsize?: number }) {
  if (!type) return null;

  // convert above if else to switch
  switch (type) {
    case "runNowOrSchedule":
      return <AlarmIcon sx={{ fontSize:fontsize}}/>;
    case "incommingText":
      return <CallReceivedIcon sx={{ fontSize:fontsize}}/>;
    case "incommingContact":
      return <ContactsIcon sx={{ fontSize:fontsize}}/>;
    case "incommingStatus":
      return <HelpIcon sx={{ fontSize:fontsize}}/>;
    case "incomingButton":
      return <MoveToInboxIcon sx={{ fontSize:fontsize}}/>;
    case "incommingTextOrButton":
      return <MoveToInboxIcon sx={{ fontSize:fontsize}}/>;
    case "replyBackToSender":
      return <ReplyIcon sx={{ fontSize:fontsize}}/>;
    case "replyAndNotifyBoth":
      return <SendIcon sx={{ fontSize:fontsize}}/>;
    case "notifyOther":
      return <ReplyAllIcon sx={{ fontSize:fontsize}}/>;
    case "addToContact":
      return <ContactsIcon sx={{ fontSize:fontsize}}/>;
    case "tag":
      return <LocalOfferIcon sx={{ fontSize:fontsize}}/>;
    case "template":
      return <ViewQuiltIcon sx={{ fontSize:fontsize}}/>;
    case "recurring":
      return <TimerIcon sx={{ fontSize:fontsize}}/>;
    case "sechedule":
      return <WatchLaterIcon sx={{ fontSize:fontsize}}/>;
    case "click":
      return <AdsClickIcon sx={{ fontSize:fontsize}}/>;
    case "notification":
      return <NotificationsActiveIcon sx={{ fontSize:fontsize}}/>;
    case "phoneNotification":
      return <PermPhoneMsgIcon sx={{ fontSize:fontsize}}/>;
    case "doNotDistrub":
      return <DoNotDisturbOffIcon sx={{ fontSize:fontsize}}/>;
    case "message":
      return <MessageIcon sx={{ fontSize:fontsize}}/>;
    case "addContact":
      return <PermContactCalendarIcon sx={{ fontSize:fontsize}}/>;
    case "text":
      return <TextSnippetIcon sx={{ fontSize:fontsize}}/>;
    case "status":
      return <SignalWifiStatusbar4BarIcon sx={{ fontSize:fontsize}}/>;
    default:
      return null;
  }
}
