'use client';

import React, { useState, useEffect } from 'react';
import { sk8Debug } from '@/lib/debugger';

interface DebugPanelProps {
  isVisible?: boolean;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  isVisible = process.env.NODE_ENV === 'development',
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // Intercept console.log to capture debug messages
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    const captureLog = (level: string, ...args: unknown[]) => {
      const message = args
        .map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        )
        .join(' ');

      if (message.includes('🛹 Sk8Hub')) {
        setLogs(prev => [
          ...prev.slice(-49),
          `[${new Date().toLocaleTimeString()}] ${message}`,
        ]);
      }
    };

    console.log = (...args) => {
      originalLog(...args);
      captureLog('LOG', ...args);
    };

    console.error = (...args) => {
      originalError(...args);
      captureLog('ERROR', ...args);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      captureLog('WARN', ...args);
    };

    console.info = (...args) => {
      originalInfo(...args);
      captureLog('INFO', ...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Toggle Debug Panel"
      >
        🐛
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute bottom-20 left-4 w-96 max-h-96 bg-black/90 backdrop-blur-sm rounded-lg border border-purple-500/50 pointer-events-auto">
            <div className="flex items-center justify-between p-3 border-b border-purple-500/30">
              <h3 className="text-purple-400 font-semibold">🛹 Sk8Hub Debug</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setLogs([])}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No debug messages yet...
                </p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="text-xs font-mono text-green-400 whitespace-pre-wrap"
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Debug Actions */}
            <div className="p-3 border-t border-purple-500/30">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() =>
                    sk8Debug.log('Manual debug test', {
                      component: 'DebugPanel',
                    })
                  }
                  className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs"
                >
                  Test Log
                </button>
                <button
                  onClick={() => sk8Debug.startTimer('Test Timer')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                >
                  Start Timer
                </button>
                <button
                  onClick={() => sk8Debug.endTimer('Test Timer')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                >
                  End Timer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DebugPanel;
