/* eslint-disable no-empty-pattern */
import { expect, test as base } from '@playwright/test';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

//schema/type of reg data fields
export type RegData = {
    firstName: string,
    lastName: string,
    telephone: string,
    password: string,
    subscribeNewsletter: string
}

type csvFixture = {
    regData: RegData[];
}

export const dataTest = base.extend<csvFixture>({
    regData: async ({ }, use) => {
        const fileContent = fs.readFileSync('./data/register.csv', 'utf-8');
        const registerationData: RegData[] = parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });
        await use(registerationData);
    }
});

// JSON Fixture
type jsonFixture = {
    regDataJson: RegData[];
}

export const testWithJson = base.extend<jsonFixture>({
    regDataJson: async ({ }, use) => {
        const fileContent = fs.readFileSync('./data/register.json', 'utf-8');
        const registerationData: RegData[] = JSON.parse(fileContent);
        await use(registerationData);
    }
});

// Excel Fixture
type excelFixture = {
    regDataExcel: RegData[];
}

export const testWithExcel = base.extend<excelFixture>({
    regDataExcel: async ({ }, use) => {
        const workbook = XLSX.readFile('./data/register.xlsx');
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const registerationData: RegData[] = XLSX.utils.sheet_to_json(worksheet);
        await use(registerationData);
    }
});


export { expect };
