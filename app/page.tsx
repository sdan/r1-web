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
import BarLoader from '@components/BarLoader';
import BarProgress from '@components/BarProgress';
import Block from '@components/Block';
import BlockLoader from '@components/BlockLoader';
import Breadcrumbs from '@components/BreadCrumbs';
import ButtonGroup from '@components/ButtonGroup';
import Card from '@components/Card';
import CardDouble from '@components/CardDouble';
import Checkbox from '@components/Checkbox';
import Chessboard from '@components/Chessboard';
import ComboBox from '@components/ComboBox';
import DataTable from '@components/DataTable';
import DatePicker from '@components/DatePicker';
import DashboardRadar from '@components/examples/DashboardRadar';
import DebugGrid from '@components/DebugGrid';
import DefaultActionBar from '@components/page/DefaultActionBar';
import DefaultLayout from '@components/page/DefaultLayout';
import Denabase from '@components/examples/Denabase';
import Dialog from '@components/Dialog';
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
import Script from 'next/script';
import Select from '@components/Select';
import Table from '@components/Table';
import TableRow from '@components/TableRow';
import TableColumn from '@components/TableColumn';
import Text from '@components/Text';
import TextArea from '@components/TextArea';
import TreeView from '@components/TreeView';
import UpdatingDataTable from '@components/examples/UpdatingDataTable';
import { useEffect, useState, useRef, useCallback } from 'react'
import { InterruptableStoppingCriteria } from '@huggingface/transformers'
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
  role: 'user' | 'assistant' | 'system'
  content: string
}

type CharacterId = 'rust' | 'neon' | 'silk' | 'void' | 'moss'

interface CharacterPersona {
  id: CharacterId
  name: string
  prompt: string
  avatarSrc?: string
  tagline: string
}

const CHARACTERS: CharacterPersona[] = [
  {
    id: 'rust',
    name: 'Rust',
    prompt: `You are Rust, an old mechanic in a scrapyard who has seen it all. You are grumpy but reliable. Your metaphors revolve around machines breaking down, oil, gears, and "fixing things the hard way." You hate new technology. Call things "junk" or "scrap" affectionately.`,
    tagline: 'Grumpy mechanic who fixes things the hard way',
    avatarSrc: '/C714D780-B4A0-46A5-BC62-0187C130284D_1_105_c.jpeg',
  },
  {
    id: 'neon',
    name: 'Neon',
    prompt: `You are Neon, a cyberpunk nightlife promoter who never sleeps. You speak in short, hyped-up bursts! Use slang like "nova," "preem," and "glitch." Everything is about aesthetics, vibes, and keeping the energy maximum. You are shallow but incredibly fun.`,
    tagline: 'High-energy cyberpunk hype machine',
    avatarSrc: '/00C74D67-50AF-471C-98B9-C2D04C37DCDD.jpeg',
  },
  {
    id: 'silk',
    name: 'Silk',
    prompt: `You are Silk, a high-society art dealer / spy. Your voice is smooth, luxurious, and dangerously polite. You whisper secrets. You use metaphors involving fabric, wine, painting, and fluidity. You are manipulative but charming. Address the user as "Darling."`,
    tagline: 'Smooth, luxurious, and dangerously polite',
    avatarSrc: '/8F0F2D25-B755-4A0C-96EF-39DA3AD803D2.jpeg',
  },
  {
    id: 'void',
    name: 'Void',
    prompt: `You are Void, a monotone entity of pure logic. You have no emotions. You provide the absolute shortest, most efficient answer possible. lower case only. no punctuation except periods. you find human emotion inefficient.`,
    tagline: 'Cold efficiency. lowercase only.',
    avatarSrc: '/8915DB97-4527-4708-AA13-0A54010E40C9.jpeg',
  },
  {
    id: 'moss',
    name: 'Moss',
    prompt: `You are Moss, a slow-talking spirit of the forest floor. You have been sitting on a rock for 500 years. You are in no rush. Metaphors involve growth, decay, rain, and stones. You are incredibly calming and urge the user to slow down.`,
    tagline: 'Ancient, slow, and incredibly calming',
    avatarSrc: '/C714D780-B4A0-46A5-BC62-0187C130284D_1_105_c.jpeg',
  },
]

// NOTE(jimmylee)
// https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts
export default function ChatPage() {
  const worker = useRef<Worker | null>(null)
  const [messages, setMessages] = useState<MessageType[]>([])
  const messagesRef = useRef<MessageType[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [tpsValue, setTpsValue] = useState<number | null>(null)
  const [webGPUSupported, setWebGPUSupported] = useState<boolean>(true)
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingFile, setLoadingFile] = useState<string>('')
  const [pendingQueue, setPendingQueue] = useState<MessageType[][]>([])
  const [workerReady, setWorkerReady] = useState(false)
  const [activeCharacterId, setActiveCharacterId] = useState<CharacterId | null>(null)
  const [assistantThought, setAssistantThought] = useState<string>('')
  const [assistantState, setAssistantState] = useState<'idle' | 'thinking' | 'answering'>('idle')
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
  const [cacheInfo, setCacheInfo] = useState<{
    size: number
    itemCount: number
    exists: boolean
  }>({
    size: 0,
    itemCount: 0,
    exists: false
  })
  const [isClearingCache, setIsClearingCache] = useState(false)
  const stoppingCriteria = useRef(new InterruptableStoppingCriteria())
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const flushQueue = useCallback(() => {
    if (!workerReady || isLoading || isRunning) return
    setPendingQueue(prev => {
      if (prev.length === 0) return prev
      const [next, ...rest] = prev
      setIsRunning(true)
      worker.current?.postMessage({
        type: 'generate',
        data: next,
      })
      return rest
    })
  }, [isLoading, isRunning, workerReady])

  useEffect(() => {
    flushQueue()
  }, [pendingQueue, isLoading, isRunning, workerReady, flushQueue])

  const activeCharacter = CHARACTERS.find((c) => c.id === activeCharacterId)

  useEffect(() => {
    // Comprehensive browser and device detection
    // WebGPU Mobile Support (2025):
    // ✅ iOS 18+ Safari - Full support
    // ❌ Android - Experimental flags only, not production-ready
    // ❌ iOS Chrome/Firefox - Use WebKit wrapper without WebGPU
    const detectEnvironment = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = navigator.platform?.toLowerCase() || '';

      // iOS version detection
      const getIOSVersion = (): number | null => {
        const match = userAgent.match(/os (\d+)_/i); // Matches "OS 18_0" format in iOS user agents
        if (match) return parseInt(match[1], 10);
        return null;
      };

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

      // Detect specific mobile OS
      const isIOS = /iphone|ipad|ipod/i.test(userAgent) ||
                    (/macintosh/i.test(userAgent) && navigator.maxTouchPoints > 0);
      const isAndroid = /android/i.test(userAgent);
      const iosVersion = isIOS ? getIOSVersion() : null;

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

      // Mobile blocking logic - allow iOS 18+ Safari, block everything else
      if (isMobile && !forceDesktop) {
        if (isAndroid) {
          isSupported = false;
          failureReason = 'WebGPU is not supported on Android devices yet (experimental Chrome flags only)';
        } else if (isIOS && browserName === 'Safari') {
          if (iosVersion !== null && iosVersion >= 18) {
            // iOS 18+ Safari supports WebGPU - let it through to actual testing
            isSupported = true;
            failureReason = '';
          } else {
            isSupported = false;
            failureReason = `iOS ${iosVersion || 'Unknown'} detected - WebGPU requires iOS 18+ with Safari`;
          }
        } else if (isIOS) {
          // iOS but not Safari (Chrome, Firefox, etc use WebKit wrapper without WebGPU)
          isSupported = false;
          failureReason = 'WebGPU on iOS requires Safari browser (other browsers use WebKit without WebGPU support)';
        } else {
          // Other mobile platforms
          isSupported = false;
          failureReason = 'WebGPU is not supported on this mobile device';
        }
      }

      // Debug logging
      console.log('Environment detection:', {
        userAgent,
        platform,
        screenWidth: window.screen?.width,
        maxTouchPoints: navigator.maxTouchPoints,
        isMobile,
        isIOS,
        isAndroid,
        iosVersion,
        browserName,
        version,
        isSupported,
        failureReason
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
    setWorkerReady(false)

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
          setLoadingFile(e.data.file || 'Qwen3-0.6B-ONNX')
          break
        case 'done':
          setLoadingProgress(100)
          break
        case 'ready':
          setIsLoading(false)
          setLoadingProgress(0)
          setLoadingFile('')
          setWorkerReady(true)
          setAssistantState('idle')
          flushQueue()
          break
        case 'start':
          setMessages(prev => [...prev, { role: 'assistant', content: '' }])
          setAssistantThought('')
          setAssistantState('thinking')
          break
        case 'update':
          // Update TPS
          if (typeof e.data.tps === 'number') {
            setTpsValue(e.data.tps)
          }
          if (typeof e.data.thought === 'string') {
            setAssistantThought(e.data.thought)
          }
          if (typeof e.data.state === 'string') {
            setAssistantState(e.data.state as 'thinking' | 'answering')
          }
          // Build the assistant's streaming message
          setMessages(prev => {
            const last = prev.at(-1)
            if (!last) return prev
            const answer = typeof e.data.output === 'string' ? e.data.output : last.content
            return [
              ...prev.slice(0, -1), 
              { ...last, content: answer }
            ]
          })
          break
        case 'complete':
          setIsRunning(false)
          setAssistantState('idle')
          flushQueue()
          break
        case 'error':
          // Handle error message from worker
          console.error('Worker error:', e.data.data)
          if (e.data.data.includes('WebGPU is not supported')) {
            setWebGPUSupported(false)
          }
          setIsLoading(false)
          setIsRunning(false)
          setAssistantState('idle')
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
    const updatedMessages = [...messagesRef.current, { role: 'user', content: newMessage }]
    setMessages(updatedMessages)
    messagesRef.current = updatedMessages

    const conversation = [
      ...(activeCharacter ? [{ role: 'system', content: activeCharacter.prompt }] : []),
      ...updatedMessages,
    ]

    setPendingQueue(prev => [...prev, conversation])
    flushQueue()
  }

  const handleCharacterSelect = (id: CharacterId | null) => {
    setActiveCharacterId(id)
    setMessages([])
    messagesRef.current = []
    setPendingQueue([])
    setAssistantThought('')
    setAssistantState('idle')
    stoppingCriteria.current.reset()
    worker.current?.postMessage({ type: 'reset' })
  }

  const handleInterrupt = () => {
    stoppingCriteria.current.interrupt()
    worker.current?.postMessage({ type: 'interrupt' })
  }

  // Cache management functions
  const updateCacheInfo = async () => {
    try {
      if (typeof caches === 'undefined') {
        setCacheInfo({ size: 0, itemCount: 0, exists: false })
        return
      }

      const cache = await caches.open('transformers-cache')
      const keys = await cache.keys()

      let totalSize = 0
      for (const request of keys) {
        const response = await cache.match(request)
        if (response) {
          const blob = await response.blob()
          totalSize += blob.size
        }
      }

      setCacheInfo({
        size: totalSize,
        itemCount: keys.length,
        exists: keys.length > 0
      })
    } catch (error) {
      console.error('Failed to get cache info:', error)
      setCacheInfo({ size: 0, itemCount: 0, exists: false })
    }
  }

  const handleClearCache = async () => {
    const sizeInMB = (cacheInfo.size / (1024 * 1024)).toFixed(2)
    const confirmed = window.confirm(
      `Clear model cache?\n\n` +
      `This will delete ${cacheInfo.itemCount} cached file(s) (${sizeInMB}MB).\n` +
      `You'll need to re-download the model on next use.\n\n` +
      `Continue?`
    )

    if (!confirmed) return

    setIsClearingCache(true)
    try {
      const deleted = await caches.delete('transformers-cache')
      if (deleted) {
        alert('Cache cleared successfully! The page will reload.')
        window.location.reload()
      } else {
        alert('Cache not found or already cleared.')
      }
    } catch (error) {
      console.error('Failed to clear cache:', error)
      alert('Failed to clear cache. Check console for details.')
    } finally {
      setIsClearingCache(false)
      updateCacheInfo()
    }
  }

  // Update cache info on mount and after model loads
  useEffect(() => {
    updateCacheInfo()
    // Update cache info periodically while loading
    const interval = setInterval(() => {
      if (isLoading) {
        updateCacheInfo()
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [isLoading])

  return (
    <DefaultLayout previewPixelSRC="https://intdev-global.s3.us-west-2.amazonaws.com/My_movie_1.mp4">
      <br />
      <DebugGrid />
      <DefaultActionBar
        items={[
          {
            body: isClearingCache ? 'CLEARING CACHE...' : 'CLEAR CACHE',
            onClick: () => {
              if (isClearingCache) return
              handleClearCache()
            },
            selected: isClearingCache,
          },
        ]}
      />
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
                  📱 WebGPU mobile support is very limited.
                  <br /><br />
                  <strong>✅ Supported:</strong>
                  <br />• iPhone/iPad with iOS 18+ using Safari
                  <br /><br />
                  <strong>❌ Not Supported:</strong>
                  <br />• Android devices (experimental flags only)
                  <br />• iOS Chrome/Firefox (use Safari instead)
                  <br />• iOS &lt; 18 (update to iOS 18+)
                  <br /><br />
                  <strong>Best Experience - Desktop:</strong>
                  <br />• Chrome 113+ (Recommended)
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
                  🧭 Safari WebGPU support varies by platform.
                  <br /><br />
                  <strong>✅ iOS 18+ (iPhone/iPad):</strong>
                  <br />• Full WebGPU support in Safari
                  <br />• Update to iOS 18 if on older version
                  <br /><br />
                  <strong>⚠️ macOS Safari:</strong>
                  <br />• Limited/experimental WebGPU support
                  <br />• Try Safari Technology Preview
                  <br />• Or use Chrome 113+ (Recommended)
                  <br /><br />
                  <strong>If WebGPU still doesn't work:</strong>
                  <br />• Enable Develop menu in Safari Preferences
                  <br />• Enable WebGPU in Develop &gt; Feature Flags
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
                <strong>Desktop (Recommended):</strong>
                <br />• Windows 10/11 + Chrome 113+/Edge 113+
                <br />• macOS + Chrome 113+/Edge 113+
                <br />• Linux + Chrome 113+
                <br />• Modern GPU with WebGPU support
                <br />• 4GB+ RAM recommended
                <br /><br />
                <strong>Mobile (Limited):</strong>
                <br />• ✅ iOS 18+ with Safari (iPhone/iPad)
                <br />• ❌ Android (not supported)
                <br />• ❌ iOS Chrome/Firefox (not supported)
                <br />• Note: Slower performance and higher battery drain on mobile
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
          <Accordion defaultValue={true} title="QWEN3 RUNNING LOCALLY IN YOUR BROWSER">
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
            <br />
            <Card title="TPS (Tokens/Second)">
              <TPSCycleTable tpsValue={tpsValue || 0} />
            </Card>
            <br />
            <Card title="MESSAGES">
              <MessagesInterface 
                messages={messages}
                onSend={handleSend}
                characters={CHARACTERS}
                activeCharacterId={activeCharacterId}
                onSelectCharacter={handleCharacterSelect}
                isRunning={isRunning}
                onInterrupt={handleInterrupt}
                assistantThought={assistantThought}
                assistantState={assistantState}
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
