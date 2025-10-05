#!/usr/bin/env node

const { Command } = require('commander');
const { analyzeProject } = require('./analyzer');
const { generateReport } = require('./reporter');
const chalk = require('chalk');
const path = require('path');

const program = new Command();

program
  .name('baseline-audit')
  .description('Audit codebase for web features and their Baseline status')
  .version('1.0.0');

program
  .command('audit')
  .description('Analyze project for web features usage')
  .option('-p, --path <path>', 'Project path to analyze', process.cwd())
  .option('-o, --output <format>', 'Output format (json|html|console)', 'console')
  .option('-f, --file <file>', 'Output file path')
  .option('--include <patterns>', 'File patterns to include (comma-separated)', '**/*.{js,ts,jsx,tsx,css,scss,html}')
  .option('--exclude <patterns>', 'File patterns to exclude (comma-separated)', 'node_modules/**,dist/**,build/**')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🔍 Starting baseline analytics audit...\n'));
      
      const projectPath = path.resolve(options.path);
      const includePatterns = options.include.includes('{') ? [options.include] : options.include.split(',');
      const excludePatterns = options.exclude.split(',');
      
      console.log(chalk.gray(`Analyzing: ${projectPath}`));
      console.log(chalk.gray(`Include: ${includePatterns.join(', ')}`));
      console.log(chalk.gray(`Exclude: ${excludePatterns.join(', ')}\n`));
      
      const analysisResult = await analyzeProject(projectPath, {
        include: includePatterns,
        exclude: excludePatterns
      });
      
      await generateReport(analysisResult, {
        format: options.output,
        outputFile: options.file
      });
      
      console.log(chalk.green('\n✅ Audit completed successfully!'));
      
    } catch (error) {
      console.error(chalk.red('❌ Error during audit:'), error.message);
      process.exit(1);
    }
  });

program.parse();