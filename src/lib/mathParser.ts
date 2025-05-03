
import * as math from 'mathjs';

export class MathParser {
  /**
   * Parse a function input string in the format f(x) = expression
   * @param input Function input string, e.g., "f(x) = 2*x + 5"
   * @returns The parsed expression string, e.g., "2*x + 5"
   */
  static parseFunction(input: string): string {
    const match = input.match(/f\s*\(\s*x\s*\)\s*=\s*(.+)/i);
    if (!match) {
      throw new Error("Invalid function format. Use the format: f(x) = expression");
    }
    
    const expression = match[1].trim();
    
    // Validate the expression by attempting to parse it
    try {
      math.parse(expression);
      return expression;
    } catch (error) {
      throw new Error(`Invalid math expression: ${(error as Error).message}`);
    }
  }
  
  /**
   * Create an evaluator function from a math expression string
   * @param expression Math expression string, e.g., "2*x + 5"
   * @returns A function that takes x as input and returns the evaluated result
   */
  static createEvaluator(expression: string): (x: number) => number {
    try {
      const node = math.parse(expression);
      const compiled = node.compile();
      
      return (x: number): number => {
        try {
          const result = compiled.evaluate({ x });
          
          // Check if the result is a valid number
          if (typeof result !== 'number' || !isFinite(result)) {
            return NaN;
          }
          
          return result;
        } catch {
          return NaN;
        }
      };
    } catch {
      // Return a function that always returns NaN if we can't parse the expression
      return () => NaN;
    }
  }
}
