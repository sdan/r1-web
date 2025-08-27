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
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingFile, setLoadingFile] = useState<string>('')
  const [browserInfo, setBrowserInfo] = useState<{
    isMobile: boolean
    browserName: string
    version: string
    isSupported: boolean
    failureReason: string
  }>({
    isMobile: false,
    browserName: 'Unknown',
    version: 'Unknown',
    isSupported: true,
    failureReason: ''
  })
  const stoppingCriteria = useRef(new InterruptableStoppingCriteria())

  useEffect(() => {
    // Comprehensive browser and device detection
    const detectEnvironment = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = navigator.platform?.toLowerCase() || '';
      
      // Mobile detection - more accurate approach with DevTools detection
      const isMobile = (() => {
        // Detect if we're in Chrome DevTools device emulation mode
        const isDevToolsEmulation = platform === 'macintel' && userAgent.includes('mobile') && 
                                   userAgent.includes('android');
        
        // If using DevTools emulation, treat as desktop
        if (isDevToolsEmulation) {
          console.log('Detected Chrome DevTools device emulation - treating as desktop');
          return false;
        }
        
        // Check user agent for mobile keywords
        const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
        if (mobileRegex.test(userAgent)) return true;
        
        // iPad specific check (since iPad user agents don't contain "mobile")
        if (/ipad/i.test(userAgent) || (/macintosh/i.test(userAgent) && navigator.maxTouchPoints > 0)) {
          return true;
        }
        
        // Check screen size as additional indicator (mobile screens are typically smaller)
        // But be more lenient to avoid catching tablet/desktop browsers in small windows
        if (window.screen && window.screen.width < 480) return true;
        
        // Check for mobile-specific platform strings
        if (/android|iphone|ipod|blackberry/i.test(platform)) return true;
        
        return false;
      })();
      
      // Browser detection with version
      let browserName = 'Unknown';
      let version = 'Unknown';
      let isSupported = true; // Assume supported until we test
      let failureReason = '';
      
      if (userAgent.includes('firefox')) {
        browserName = 'Firefox';
        const match = userAgent.match(/firefox\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        // Will test WebGPU availability below instead of assuming
      } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        browserName = 'Safari';
        const match = userAgent.match(/version\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        // Will test WebGPU availability below instead of assuming
      } else if (userAgent.includes('edge')) {
        browserName = 'Edge';
        const match = userAgent.match(/edg\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        // Will test WebGPU availability below instead of version checking
      } else if (userAgent.includes('chrome')) {
        const isChromeCanary = userAgent.includes('canary');
        browserName = isChromeCanary ? 'Chrome Canary' : 'Chrome';
        const match = userAgent.match(/chrome\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        // Will test WebGPU availability below instead of version checking
      }
      
      // Allow manual override via URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const forceDesktop = urlParams.get('desktop') === 'true';
      
      if (isMobile && !forceDesktop) {
        isSupported = false;
        failureReason = 'WebGPU is not supported on mobile devices';
      }
      
      // Debug logging
      console.log('Environment detection:', {
        userAgent,
        platform,
        screenWidth: window.screen?.width,
        maxTouchPoints: navigator.maxTouchPoints,
        isMobile,
        browserName,
        version
      });
      
      return { isMobile, browserName, version, isSupported, failureReason };
    };

    // Check WebGPU support by actually testing it
    const checkWebGPU = async () => {
      const envInfo = detectEnvironment();
      
      try {
        // First check mobile override
        if (envInfo.isMobile) {
          throw new Error("WebGPU is not supported on mobile devices");
        }
        
        // Check if WebGPU API exists
        if (!navigator.gpu) {
          throw new Error(`WebGPU API not available in ${envInfo.browserName} ${envInfo.version} - try enabling WebGPU in browser flags`);
        }
        
        console.log('WebGPU API available, testing adapter...');
        
        // Test adapter request with timeout
        const adapterPromise = navigator.gpu.requestAdapter();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("WebGPU adapter request timed out")), 5000);
        });
        
        const adapter = await Promise.race([adapterPromise, timeoutPromise]);
        
        if (!adapter) {
          throw new Error(`No WebGPU adapter available in ${envInfo.browserName} ${envInfo.version} - GPU may not support WebGPU or drivers need updating`);
        }
        
        console.log('WebGPU adapter found, testing device creation...');
        
        // Test device creation
        try {
          const device = await adapter.requestDevice();
          device.destroy(); // Clean up test device
          console.log("WebGPU fully supported:", { adapter, browserInfo: envInfo });
          
          // Update browser info with success
          setBrowserInfo({
            ...envInfo,
            isSupported: true,
            failureReason: ''
          });
          setWebGPUSupported(true);
          
        } catch (deviceError) {
          throw new Error(`WebGPU device creation failed in ${envInfo.browserName} ${envInfo.version}: ${deviceError.message}`);
        }
        
      } catch (error) {
        console.error('WebGPU support check failed:', error);
        setBrowserInfo({ 
          ...envInfo, 
          isSupported: false,
          failureReason: error.message || 'Unknown WebGPU error'
        });
        setWebGPUSupported(false);
      }
    };
    
    checkWebGPU();
    
    worker.current = new Worker(new URL('../public/worker.js', import.meta.url), {
      type: 'module'
    })

    const onMessage = (e: MessageEvent) => {
      switch (e.data.status) {
        case 'loading':
          setIsLoading(true)
          setLoadingFile(e.data.data || 'Loading...')
          break
        case 'initiate':
        case 'progress':
          setIsLoading(true)
          setLoadingProgress(e.data.progress || 0)
          setLoadingFile(e.data.file || 'model data')
          break
        case 'done':
          setLoadingProgress(100)
          break
        case 'ready':
          setIsLoading(false)
          setLoadingProgress(0)
          setLoadingFile('')
          break
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
          setIsLoading(false)
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
            <Text>
              <strong>⚠️ {browserInfo.browserName} {browserInfo.version} - WebGPU Not Supported</strong>
            </Text>
            <br />
            <Text>{browserInfo.failureReason}</Text>
            <br />
            <br />
            
            {browserInfo.isMobile ? (
              <Card title="MOBILE DEVICE DETECTED">
                <Text>
                  📱 This application requires WebGPU, which is not supported on mobile devices yet.
                  <br /><br />
                  <strong>Use a desktop browser instead:</strong>
                  <br />• Chrome 113+ (Recommended)
                  <br />• Chrome Canary (Latest features)
                  <br />• Edge 113+
                </Text>
              </Card>
            ) : browserInfo.browserName === 'Firefox' ? (
              <Card title="FIREFOX USERS">
                <Text>
                  🦊 Firefox doesn't support WebGPU in stable releases yet.
                  <br /><br />
                  <strong>Try Firefox Nightly:</strong>
                  <br />• Download Firefox Nightly
                  <br />• Enable dom.webgpu.enabled in about:config
                  <br />• Or use Chrome/Edge instead
                </Text>
              </Card>
            ) : browserInfo.browserName === 'Safari' ? (
              <Card title="SAFARI USERS">
                <Text>
                  🧭 Safari's WebGPU support is experimental and limited.
                  <br /><br />
                  <strong>For best experience:</strong>
                  <br />• Use Chrome 113+ (Recommended)
                  <br />• Try Safari Technology Preview
                  <br />• Enable WebGPU in Develop menu
                </Text>
              </Card>
            ) : (
              <Card title="BROWSER COMPATIBILITY">
                <Text>
                  <strong>Recommended Browsers:</strong>
                  <br />• Chrome 113+ (Best support)
                  <br />• Chrome Canary (Latest features)  
                  <br />• Edge 113+
                  <br /><br />
                  <strong>If using a supported browser:</strong>
                  <br />• Enable WebGPU in chrome://flags/
                  <br />• Try launching with --enable-unsafe-webgpu flag
                  <br />• Update your graphics drivers
                  <br />• Restart your browser
                </Text>
              </Card>
            )}
            
            <br />
            <Card title="SYSTEM REQUIREMENTS">
              <Text>
                <strong>Minimum Requirements:</strong>
                <br />• Desktop/laptop computer (not mobile)
                <br />• Modern GPU with WebGPU support
                <br />• 4GB+ RAM recommended
                <br />• Chrome 113+ or Edge 113+
                <br /><br />
                <strong>Tested Configurations:</strong>
                <br />• Windows 10/11 + Chrome
                <br />• macOS + Chrome/Edge  
                <br />• Linux + Chrome
              </Text>
            </Card>
            
            <br />
            <Card title="DIAGNOSTIC INFORMATION">
              <Text>
                <strong>Browser:</strong> {browserInfo.browserName} {browserInfo.version}
                <br />
                <strong>Platform:</strong> {browserInfo.isMobile ? 'Mobile' : 'Desktop'} ({navigator.platform})
                <br />
                <strong>WebGPU API:</strong> {navigator.gpu ? '✅ Available' : '❌ Not Available'}
                <br />
                <strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...
                <br />
                <strong>Screen:</strong> {window.screen?.width}x{window.screen?.height}
                <br />
                <strong>Memory:</strong> {(navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : 'Unknown'}
              </Text>
            </Card>
          </AlertBanner>
        ) : (
          <Accordion defaultValue={true} title="DEEPSEEK R-1 RUNNING LOCALLY IN YOUR BROWSER">
            {isLoading && (
              <>
                <br />
                <Card title="MODEL LOADING">
                  <Text>{loadingFile}</Text>
                  <br />
                  <BarProgress progress={loadingProgress} fillChar="█" />
                  <br />
                  <Text>{Math.round(loadingProgress)}% complete</Text>
                </Card>
              </>
            )}
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
            <Card title="">
              <div style={{ 
                position: 'relative',
                overflow: 'hidden',
                padding: '40px 24px',
                textAlign: 'left',
                background: 'var(--theme-background)',
                minHeight: '120px'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-40px',
                  width: '200px',
                  height: '200px',
                  backgroundImage: 'url(https://prava.co/outputpravalogo.jpg)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  opacity: '0.08',
                  zIndex: 0
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <Text style={{ 
                    fontSize: '24px', 
                    fontWeight: '300', 
                    lineHeight: '1.3',
                    marginBottom: '16px',
                    letterSpacing: '-0.01em'
                  }}>
                    Exceptionally talented individuals.
                  </Text>
                  
                  <Text style={{ 
                    fontSize: '16px', 
                    opacity: 0.7, 
                    marginBottom: '24px',
                    fontWeight: '400',
                    lineHeight: '1.4'
                  }}>
                    We're training models to diffuse artificial general intelligence across every corner of the economy.
                  </Text>
                  
                  <a
                    href="https://prava.co/careers"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      color: 'var(--theme-text)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderBottom: '1px solid var(--theme-text)',
                      paddingBottom: '2px',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = '0.7';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = '1';
                    }}
                  >
                    View careers
                  </a>
                </div>
              </div>
            </Card>
            <br />
          </Accordion>
        )}
      </Grid>
      <ModalStack />
    </DefaultLayout>
  );
}