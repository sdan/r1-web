'use client'
import '@root/global.scss';

import * as Constants from '@common/constants';
import * as Utilities from '@common/utilities';

// NOTE(jimmylee): This is a kitchen sink of all components.
// When forking or remixing, you'll likely only need a few.
import Accordion from '@components/Accordion';
import ActionBar from '@components/ActionBar';
import ActionButton from '@components/ActionButton';
import ActionListItem from '@components/ActionListItem';
import AlertBanner from '@components/AlertBanner';
import AS400 from '@components/examples/AS400';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import BarLoader from '@components/BarLoader';
import BarProgress from '@components/BarProgress';
import Block from '@components/Block';
import BlockLoader from '@components/BlockLoader';
import Breadcrumbs from '@components/BreadCrumbs';
import Button from '@components/Button';
import ButtonGroup from '@components/ButtonGroup';
import Card from '@components/Card';
import CardDouble from '@components/CardDouble';
import Checkbox from '@components/Checkbox';
import Chessboard from '@components/Chessboard';
import CodeBlock from '@components/CodeBlock';
import ContentFluid from '@components/ContentFluid';
import ComboBox from '@components/ComboBox';
import DataTable from '@components/DataTable';
import DatePicker from '@components/DatePicker';
import DashboardRadar from '@components/examples/DashboardRadar';
import DebugGrid from '@components/DebugGrid';
import DefaultActionBar from '@components/page/DefaultActionBar';
import DefaultLayout from '@components/page/DefaultLayout';
import Denabase from '@components/examples/Denabase';
import Dialog from '@components/Dialog';
import Divider from '@components/Divider';
import Drawer from '@components/Drawer';
import DropdownMenuTrigger from '@components/DropdownMenuTrigger';
import Grid from '@components/Grid';
import HoverComponentTrigger from '@components/HoverComponentTrigger';
import Indent from '@components/Indent';
import Input from '@components/Input';
import IntDevLogo from '@components/svg/IntDevLogo';
import ListItem from '@components/ListItem';
import Message from '@components/Message';
import MessageViewer from '@components/MessageViewer';
import MessagesInterface from '@components/examples/MessagesInterface';
import ModalAlert from '@components/modals/ModalAlert';
import ModalCanvasSnake from '@components/modals/ModalCanvasSnake';
import ModalCanvasPlatformer from '@components/modals/ModalCanvasPlatformer';
import ModalChess from '@components/modals/ModalChess';
import ModalCreateAccount from '@components/modals/ModalCreateAccount';
import ModalError from '@components/modals/ModalError';
import ModalMatrixModes from '@components/modals/ModalMatrixModes';
import ModalStack from '@components/ModalStack';
import ModalTrigger from '@components/ModalTrigger';
import Navigation from '@components/Navigation';
import NumberRangeSlider from '@components/NumberRangeSlider';
import Package from '@root/package.json';
import RadioButtonGroup from '@components/RadioButtonGroup';
import Row from '@components/Row';
import RowSpaceBetween from '@components/RowSpaceBetween';
import Script from 'next/script';
import Select from '@components/Select';
import SidebarLayout from '@components/SidebarLayout';
import Table from '@components/Table';
import TableRow from '@components/TableRow';
import TableColumn from '@components/TableColumn';
import Text from '@components/Text';
import TextArea from '@components/TextArea';
import TreeView from '@components/TreeView';
import UpdatingDataTable from '@components/examples/UpdatingDataTable';
import { useEffect, useState, useRef } from 'react'
import { InterruptableStoppingCriteria } from '@huggingface/transformers'
import GPUMonitor from '@components/GPUMonitor';
import TPSCycleTable from '@components/examples/TPSCycleTable';

export const dynamic = 'force-static';

// NOTE(jimmylee)
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata


interface MessageType {
  role: 'user' | 'assistant'
  content: string
}

// NOTE(jimmylee)
// https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts
export default function ChatPage() {
  const worker = useRef<Worker | null>(null)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [tpsValue, setTpsValue] = useState<number | null>(null)
  const stoppingCriteria = useRef(new InterruptableStoppingCriteria())

  // Track loading states
  const [modelLoading, setModelLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState('')

  useEffect(() => {
    worker.current = new Worker(new URL('../public/worker.js', import.meta.url), {
      type: 'module'
    })

    // Ask worker to load the tokenizer/model right away
    worker.current.postMessage({ type: 'load' })

    const onMessage = (e: MessageEvent) => {
      // Grab statuses from public/worker.js
      switch (e.data.status) {
        case 'loading':
          setModelLoading(true)
          setLoadingMessage(String(e.data.data || ''))
          break
        case 'initiate':
          setModelLoading(true)
          setLoadingProgress(0)
          setLoadingMessage(`Downloading ${e.data.file} ...`)
          break
        case 'progress':
          setModelLoading(true)
          setLoadingProgress(e.data.progress || 0)
          setLoadingMessage(`Loading ${e.data.file} (${e.data.progress}%)`)
          break
        case 'done':
          setLoadingProgress(100)
          setLoadingMessage(`${e.data.file} loaded`)
          break
        case 'ready':
          // All loading is finished, hide the bar
          setModelLoading(false)
          setLoadingProgress(100)
          setLoadingMessage('Model ready!')
          break

        // When generation starts
        case 'start':
          setMessages(prev => [...prev, { role: 'assistant', content: '' }])
          break

        // As tokens stream in
        case 'update':
          if (typeof e.data.tps === 'number') {
            setTpsValue(e.data.tps)
          }
          setMessages(prev => {
            const last = prev.at(-1)
            if (!last) return prev
            return [...prev.slice(0, -1), { ...last, content: last.content + e.data.output }]
          })
          break

        // When generation completes
        case 'complete':
          setIsRunning(false)
          break

        // Error states etc.
        case 'error':
          console.error('Worker error:', e.data)
          setModelLoading(false)
          break
      }
    }

    worker.current.addEventListener('message', onMessage)
    return () => worker.current?.removeEventListener('message', onMessage)
  }, [])

  const handleSend = (newMessage: string) => {
    setMessages(prev => [...prev, { role: 'user', content: newMessage }])
    setIsRunning(true)
    worker.current?.postMessage({
      type: 'generate',
      data: [...messages, { role: 'user', content: newMessage }]
    })
  }

  const handleInterrupt = () => {
    stoppingCriteria.current.interrupt()
    worker.current?.postMessage({ type: 'interrupt' })
  }

  return (
    <DefaultLayout previewPixelSRC="https://intdev-global.s3.us-west-2.amazonaws.com/template-app-icon.png">
      <br />
      <DebugGrid />
      <DefaultActionBar />

      {/* Show a loading bar if the model is still loading */}
      {modelLoading && (
        <div style={{ padding: '0 1rem' }}>
          <BarLoader progress={loadingProgress} />
          <p>{loadingMessage}</p>
        </div>
      )}

      <Grid>
        <Accordion defaultValue={true} title="DEEPSEEK R1 RUNNING LOCALLY IN YOUR BROWSER">
          {/* <br />
          <Card title="GPU UTILIZATION">
            <GPUMonitor />
          </Card> */}
          <br />
          <Card title="TPS (Tokens/Second)">
            <TPSCycleTable tpsValue={tpsValue || 0} />
          </Card>
          <br />
          <Card title="MESSAGES">
            <MessagesInterface 
              messages={messages}
              onSend={handleSend}
              isRunning={isRunning}
              onInterrupt={handleInterrupt}
            />
          </Card>
          <br />
        </Accordion>
      </Grid>
      <ModalStack />
    </DefaultLayout>
  );
}
