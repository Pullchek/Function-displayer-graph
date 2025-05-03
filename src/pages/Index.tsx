
import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { MathParser } from "@/lib/mathParser";
import { FunctionGraph } from "@/components/FunctionGraph";

const Index = () => {
  const [functionInput, setFunctionInput] = useState<string>("f(x) = x^2");
  const [parsedFunction, setParsedFunction] = useState<{
    expression: string;
    error: string | null;
  }>({ expression: "x^2", error: null });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFunctionInput(e.target.value);
  };
  
  const handlePlotFunction = () => {
    try {
      const parsedExpr = MathParser.parseFunction(functionInput);
      setParsedFunction({ expression: parsedExpr, error: null });
      toast({
        title: "Function plotted successfully",
        description: `f(x) = ${parsedExpr}`,
      });
    } catch (error) {
      setParsedFunction({ expression: "", error: (error as Error).message });
      toast({
        title: "Error parsing function",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Mathematical Function Grapher</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Function Input</CardTitle>
              <CardDescription>
                Enter a mathematical function like f(x) = x^2 + 3x - 1
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="function-input">Function</Label>
                  <Input 
                    id="function-input"
                    value={functionInput}
                    onChange={handleInputChange}
                    placeholder="e.g., f(x) = x^2 + 3x - 1"
                  />
                </div>
                
                <Button onClick={handlePlotFunction} className="w-full">
                  Plot Function
                </Button>
                
                {parsedFunction.error && (
                  <div className="text-sm text-red-500 mt-2">
                    {parsedFunction.error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Graph</CardTitle>
              <CardDescription>
                {parsedFunction.expression 
                  ? `f(x) = ${parsedFunction.expression}` 
                  : "Enter a function to see its graph"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px]">
                {parsedFunction.expression && (
                  <FunctionGraph expression={parsedFunction.expression} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
