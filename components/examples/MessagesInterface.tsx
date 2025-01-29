import Avatar from '@components/Avatar';
import ActionButton from '@components/ActionButton';
import Divider from '@components/Divider';
import DropdownMenuTrigger from '@components/DropdownMenuTrigger';
import Indent from '@components/Indent';
import Input from '@components/Input';
import Message from '@components/Message';
import MessageViewer from '@components/MessageViewer';
import ModalError from '@components/modals/ModalError';
import Navigation from '@components/Navigation';
import RowEllipsis from '@components/RowEllipsis';
import SidebarLayout from '@components/SidebarLayout';
import Button from '@components/Button';
import { useState } from 'react';

import * as React from 'react';

interface MessagesInterfaceProps {
  messages: Array<{ role: string; content: string }>
  onSend: (message: string) => void
  isRunning: boolean
  onInterrupt: () => void
}

const ChatPreviewInline = (props) => {
  return <RowEllipsis style={{ opacity: 0.5, marginBottom: `10px` }}>{props.children}</RowEllipsis>;
};

const MessagesInterface: React.FC<MessagesInterfaceProps> = ({ 
  messages, 
  onSend,
  isRunning,
  onInterrupt 
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSend(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div style={{ minWidth: '28ch' }}>
      <Navigation
        logo="✶"
        left={
          <>
            <DropdownMenuTrigger
              items={[
                {
                  icon: '⊹',
                  children: 'Open',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'New Message',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Quick Look',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Close Messages',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Open Conversation in New Window',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Print...',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
              ]}
            >
              <ActionButton>FILE</ActionButton>
            </DropdownMenuTrigger>

            <DropdownMenuTrigger
              items={[
                {
                  icon: '⊹',
                  children: 'Undo',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Redo',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Cut',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Copy',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Paste',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Paste and Match Style',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Delete',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Select All',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Find...',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Find Next',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Find Previous',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Spelling and Grammar',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Substitutions',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Speech',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Send Message',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Reply to Last Message',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Tapback Last Message',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Edit Last Message',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Autofill',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Start Dictation',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Emoji & Symbols',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
              ]}
            >
              <ActionButton>EDIT</ActionButton>
            </DropdownMenuTrigger>
            <DropdownMenuTrigger
              items={[
                {
                  icon: '⊹',
                  children: 'Show Tab Bar',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Show All Tabs',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Make Text Bigger',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Make Text Normal Size',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Make Text Smaller',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'All Messages',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Known Senders',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Unknown Senders',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Unread Messages',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Recently Delete',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Show Sidebar',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Enter Full Screen',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
              ]}
            >
              <ActionButton>VIEW</ActionButton>
            </DropdownMenuTrigger>
          </>
        }
        right={
          <>
            <DropdownMenuTrigger
              items={[
                {
                  icon: '⊹',
                  children: 'Search',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
                {
                  icon: '⊹',
                  children: 'Messages Help',
                  modal: ModalError,
                  modalProps: {
                    message: <>Non-fatal error detected: error FOOLISH (Please contact Sacred Computer support.)</>,
                    title: `MESSAGES`,
                  },
                },
              ]}
            >
              <ActionButton>HELP</ActionButton>
            </DropdownMenuTrigger>
          </>
        }
      ></Navigation>
      <Divider type="DOUBLE" />
      <SidebarLayout
        defaultSidebarWidth={12}
        isShowingHandle={true}
        sidebar={
          <>
            <Avatar src="/C714D780-B4A0-46A5-BC62-0187C130284D_1_105_c.jpeg">
              <Indent>
                Oai
                <br />
                <ChatPreviewInline>The smallest seed of an idea can grow to define or destroy you</ChatPreviewInline>
              </Indent>
            </Avatar>
            <Avatar src="/pravalogo.png">
              <Indent>
                Eas
                <br />
                <ChatPreviewInline>You're waiting for a train...</ChatPreviewInline>
              </Indent>
            </Avatar>
            <Avatar src="https://plugins.sdan.io/_next/image?url=%2Fimages%2Fpdf-logo.png&w=256&q=75">
              <Indent>
                Bean
                <br />
                <ChatPreviewInline>Paradox could collapse the dream</ChatPreviewInline>
              </Indent>
            </Avatar>
            <Avatar src="/channels4_profile.jpg">
              <Indent>
                Cook
                <br />
                <ChatPreviewInline>I will not follow in my father's footsteps</ChatPreviewInline>
              </Indent>
            </Avatar>
            <Avatar src="https://sdan.io/surya_low.jpeg">
              <Indent>
                Ed
                <br />
                <ChatPreviewInline>Those aren't my memories</ChatPreviewInline>
              </Indent>
            </Avatar>
          </>
        }
      >
        {messages.map((msg, i) => (
          msg.role === 'user' ? (
            <Message key={i}>{msg.content}</Message>
          ) : (
            <MessageViewer key={i}>{msg.content}</MessageViewer>
          )
        ))}
        
        <form onSubmit={handleSubmit}>
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isRunning}
            isBlink={!isRunning}
          />
        </form>
        <ActionButton 
          onClick={onInterrupt} 
          disabled={!isRunning}
          style={{ marginLeft: '1ch' }}
        >
          {isRunning ? 'STOP' : 'IDLE'}
        </ActionButton>
      </SidebarLayout>
    </div>
  );
};

export default MessagesInterface;
