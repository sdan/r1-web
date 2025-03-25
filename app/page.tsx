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

// Add WebGPU types
declare global {
  interface Navigator {
    gpu?: {
      requestAdapter(): Promise<GPUAdapter | null>;
    };
  }
  
  interface GPUAdapter {
    requestDevice(): Promise<GPUDevice>;
  }

  interface GPUDevice {
    destroy(): void;
  }
}

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
  const [webGPUSupported, setWebGPUSupported] = useState<boolean>(true)
  const stoppingCriteria = useRef(new InterruptableStoppingCriteria())

  useEffect(() => {
    // Check WebGPU support
    const checkWebGPU = async () => {
      try {
        // Check if WebGPU is supported in the browser
        if (!navigator.gpu) {
          throw new Error("WebGPU API not available in this browser");
        }
        
        // Try to request an adapter
        const adapter = await navigator.gpu.requestAdapter();
        
        // Log adapter info for debugging
        console.log("WebGPU adapter check:", adapter ? "Adapter found" : "No adapter found");
        
        // Even if no adapter is found, we'll still allow the app to run
        // This helps with browsers that partially support WebGPU
        if (!adapter) {
          console.warn("No suitable GPU adapter found, but continuing anyway");
          // We don't throw an error here anymore
        }
        
        // Force enable WebGPU for Chrome Canary and newer Chrome versions
        const userAgent = navigator.userAgent.toLowerCase();
        const isChrome = userAgent.includes('chrome');
        const isChromeCanary = userAgent.includes('canary');
        
        if (isChrome || isChromeCanary) {
          console.log("Chrome detected, enabling WebGPU support");
          setWebGPUSupported(true);
          return; // Exit early with WebGPU enabled
        }
        
      } catch (e) {
        console.error('WebGPU check failed:', e);
        
        // Check if we're in a Chrome-based browser that should support WebGPU
        const userAgent = navigator.userAgent.toLowerCase();
        const isChrome = userAgent.includes('chrome');
        const chromeVersion = isChrome ? 
          parseInt(userAgent.match(/chrome\/(\d+)/)?.[1] || '0', 10) : 0;
        const isChromeCanary = userAgent.includes('canary');
        
        // Log browser info for debugging
        console.log("Browser info:", { 
          userAgent, 
          isChrome, 
          chromeVersion, 
          isChromeCanary 
        });
        
        // If it's Chrome Canary or Chrome 119+, suggest enabling WebGPU flags
        if (isChromeCanary || (isChrome && chromeVersion >= 119)) {
          console.warn("You're using a browser that should support WebGPU. Try enabling WebGPU in chrome://flags");
        }
        
        setWebGPUSupported(false);
      }
    };
    
    checkWebGPU();
    
    worker.current = new Worker(new URL('../public/worker.js', import.meta.url), {
      type: 'module'
    })

    const onMessage = (e: MessageEvent) => {
      switch (e.data.status) {
        case 'start':
          setMessages(prev => [...prev, { role: 'assistant', content: '' }])
          break
        case 'update':
          // Update TPS
          if (typeof e.data.tps === 'number') {
            setTpsValue(e.data.tps)
          }
          // Build the assistant's streaming message
          setMessages(prev => {
            const last = prev.at(-1)
            if (!last) return prev
            return [
              ...prev.slice(0, -1), 
              { ...last, content: last.content + e.data.output }
            ]
          })
          break
        case 'complete':
          setIsRunning(false)
          break
        case 'error':
          // Handle error message from worker
          console.error('Worker error:', e.data.data)
          if (e.data.data.includes('WebGPU is not supported')) {
            setWebGPUSupported(false)
          }
          setIsRunning(false)
          break
      }
    }

    worker.current.addEventListener('message', onMessage)
    
    // Only load the model if WebGPU is supported
    if (navigator.gpu) {
      worker.current.postMessage({ type: 'load' })
    }
    
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
    <DefaultLayout previewPixelSRC="https://intdev-global.s3.us-west-2.amazonaws.com/My_movie_1.mp4">
      <br />
      <DebugGrid />
      <DefaultActionBar />
      <Grid>
        {!webGPUSupported ? (
          <AlertBanner>
            ⚠️ WebGPU is not supported in your browser. Please use Chrome Canary or Chrome 119+ to run this application.
            <br />
            <br />
            <Text>
              If you're using Chrome Canary or Chrome 119+, try enabling WebGPU in chrome://flags
              <br />
              You can also try launching Chrome with the --enable-unsafe-webgpu flag.
            </Text>
          </AlertBanner>
        ) : (
          <Accordion defaultValue={true} title="DEEPSEEK R-1 RUNNING LOCALLY IN YOUR BROWSER">
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
        )}
      </Grid>
      <ModalStack />
    </DefaultLayout>
  );
}