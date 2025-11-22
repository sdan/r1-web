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
import SidebarLayout from '@components/SidebarLayout';
import { useEffect, useRef, useState } from 'react';
import messageViewerStyles from '@components/MessageViewer.module.scss';

import * as React from 'react';

interface CharacterOption {
  id: string
  name: string
  avatarSrc?: string
  tagline: string
  prompt?: string
}

interface MessagesInterfaceProps {
  messages: Array<{ role: string; content: string }>
  onSend: (message: string) => void
  isRunning: boolean
  onInterrupt: () => void
  assistantThought?: string
  assistantState?: 'idle' | 'thinking' | 'answering'
  characters: CharacterOption[]
  activeCharacterId: string | null
  onSelectCharacter: (characterId: string | null) => void
}

const MessagesInterface: React.FC<MessagesInterfaceProps> = ({ 
  messages, 
  onSend,
  isRunning,
  onInterrupt,
  assistantThought,
  assistantState,
  characters,
  activeCharacterId,
  onSelectCharacter,
}) => {
  const [inputValue, setInputValue] = useState('')
  const thoughtRef = useRef<HTMLDivElement | null>(null)
  const activeCharacter = characters.find((c) => c.id === activeCharacterId)

  const handleCharacterKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, characterId: string | null) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelectCharacter(characterId)
    }
  }

  useEffect(() => {
    if (!assistantThought || !thoughtRef.current) return
    const el = thoughtRef.current
    el.scrollTop = el.scrollHeight
  }, [assistantThought])

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
            {characters.map((character) => {
              const isActive = character.id === activeCharacterId
              return (
                <div
                  key={character.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectCharacter(isActive ? null : character.id)}
                  onKeyDown={(e) => handleCharacterKeyDown(e, isActive ? null : character.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    maxWidth: '220px',
                    border: isActive ? '1px solid var(--theme-focused-foreground)' : '1px solid transparent',
                    borderRadius: '8px',
                    padding: '6px 8px',
                    marginBottom: '8px',
                    background: isActive ? 'var(--theme-foreground)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'border 120ms ease, background 120ms ease',
                    overflow: 'hidden',
                  }}
                >
                  <Avatar src={character.avatarSrc}>
                    <Indent
                      style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '160px',
                      }}
                    >
                      <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {character.name} {isActive ? '✦' : ''}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {character.tagline}
                      </div>
                    </Indent>
                  </Avatar>
                </div>
              )
            })}
          </>
        }
      >
        {messages.map((msg, i) => {
          const key = `${msg.role}-${i}-${msg.content.slice(0, 10)}`
          const isLastAssistant = msg.role === 'assistant' && i === messages.length - 1
          const hasThought = Boolean(assistantThought?.trim())
          const hasAssistantContent = msg.role === 'assistant' && Boolean(msg.content?.trim())
          const isThinkingOrAnswering = assistantState !== 'idle'
          const showThoughtInline = isLastAssistant && (isThinkingOrAnswering || hasThought)
          const showAssistantBubble = msg.role === 'assistant' && hasAssistantContent
          const thoughtHeading = assistantState === 'answering' || (!isThinkingOrAnswering && hasThought)
            ? 'Thinking (captured)'
            : 'Thinking'
          const thoughtBody = hasThought ? assistantThought : 'Thinking...'

          const thoughtBubble = showThoughtInline ? (
            <MessageViewer
              bubbleClassName={messageViewerStyles.thinkingBubble}
              triangleClassName={`${messageViewerStyles.thinkingTriangle} ${messageViewerStyles.thinkingTriangleHidden}`}
            >
              <div
                ref={thoughtRef}
                style={{
                  maxHeight: '120px',
                  minHeight: '80px',
                  overflowY: 'auto',
                  scrollBehavior: 'smooth',
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch',
                  padding: '2px 0',
                }}
              >
                <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '6px' }}>
                  {thoughtHeading}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', opacity: assistantState === 'answering' ? 0.8 : 1 }}>
                  {thoughtBody}
                </div>
              </div>
            </MessageViewer>
          ) : null

          if (msg.role === 'user') {
            return <Message key={key}>{msg.content}</Message>
          }

          return (
            <React.Fragment key={key}>
              {thoughtBubble}
              {showAssistantBubble && <MessageViewer>{msg.content}</MessageViewer>}
            </React.Fragment>
          )
        })}
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Input 
              value={inputValue}
              placeholder="Ask anything"
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isRunning}
              isBlink={!isRunning}
            />
            <div style={{ display: 'flex', gap: '1ch', alignItems: 'center', opacity: 0.7, fontSize: '12px' }}>
              <span>↵ Enter to send</span>
              <span>•</span>
              <span>Esc to blur</span>
            </div>
          </div>
        </form>
        {isRunning ? (
          <ActionButton 
            onClick={onInterrupt} 
            style={{ marginLeft: '1ch' }}
          >
            STOP
          </ActionButton>
        ) : null}
      </SidebarLayout>
    </div>
  );
};

export default MessagesInterface;
