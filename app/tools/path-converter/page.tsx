"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Download } from "lucide-react";

export default function PathConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整 textarea 高度
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      const minHeight = 400; // 最小高度 400px
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.max(scrollHeight, minHeight)}px`;
    }
  };

  // 转换路径的函数
  const convertPath = useCallback((inputText: string) => {
    setError("");
    setCopied(false);
    
    if (!inputText.trim()) {
      setOutput("");
      return;
    }

    try {
      const lines = inputText.split('\n');
      const convertedLines = lines.map(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return '';
        
        // 处理 webpack:// 格式的路径
        // 例如: webpack://teamco/src/components/xxx.vue?7300
        // 转换为: /components/xxx.vue
        
        let result = trimmedLine;
        
        // 移除 webpack:// 前缀
        if (result.startsWith('webpack://')) {
          result = result.replace(/^webpack:\/\//, '');
          
          // 移除项目名称和 src 部分（例如 teamco/src）
          // 匹配模式: 项目名/src/ 或 项目名/src
          result = result.replace(/^[^/]+\/src\//, '/');
          result = result.replace(/^[^/]+\/src$/, '/');
          
          // 移除查询参数（?xxx）
          result = result.split('?')[0];
          
          // 确保以 / 开头
          if (!result.startsWith('/')) {
            result = '/' + result;
          }
        }
        
        return result;
      });
      
      setOutput(convertedLines.join('\n'));
    } catch (e) {
      setError(`转换失败: ${e instanceof Error ? e.message : "未知错误"}`);
      setOutput("");
    }
  }, []);

  // 监听 input 变化，自动转换
  useEffect(() => {
    adjustTextareaHeight(inputRef.current);
    convertPath(input);
  }, [input, convertPath]);

  // 监听 output 变化
  useEffect(() => {
    adjustTextareaHeight(outputRef.current);
  }, [output]);

  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("复制失败:", e);
    }
  };

  const downloadResult = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted-paths.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">
              路径转换工具
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Webpack 路径转换工具</CardTitle>
            <CardDescription>
              将 webpack:// 格式的路径转换为普通文件路径。支持批量转换。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button onClick={clearAll} variant="outline">
                  清空
                </Button>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      输入路径
                    </label>
                  </div>
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      adjustTextareaHeight(e.target as HTMLTextAreaElement);
                    }}
                    placeholder='请输入 webpack:// 格式的路径，例如: webpack://teamco/src/components/SalesCrm/CustomerMan/CustomerDetail/Contacts/Contacts.vue?7300'
                    className="font-mono resize-none flex-1 min-h-[400px] overflow-y-auto"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      输出结果
                    </label>
                    {output && (
                      <div className="flex gap-2">
                        <Button
                          onClick={copyToClipboard}
                          variant="outline"
                          size="sm"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              复制
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={downloadResult}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    )}
                  </div>
                  <Textarea
                    ref={outputRef}
                    value={output}
                    onChange={(e) => {
                      setOutput(e.target.value);
                      adjustTextareaHeight(e.target as HTMLTextAreaElement);
                    }}
                    placeholder="转换后的路径将显示在这里..."
                    className="font-mono bg-gray-50 dark:bg-gray-900 resize-none flex-1 min-h-[400px] overflow-y-auto"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
