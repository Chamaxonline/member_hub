const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const excelPath = 'd:/Oruwala Grama/contact_numbers.xlsx';
const outPath = path.join(__dirname, '../MemberHub.Api/Scripts/ImportMembers_from_contact_numbers.sql');

const wb = XLSX.readFile(excelPath);
const data = XLSX.utils.sheet_to_json(wb.Sheets['Contacts'], { defval: '' });

function sqlEscape(value) {
    return String(value).replace(/'/g, "''");
}

const lines = [
    '-- Generated from contact_numbers.xlsx',
    '-- Source: d:\\Oruwala Grama\\contact_numbers.xlsx',
    '-- Maps: No. -> RegistrationNumber, Mobile Number -> MobileNumber',
    '-- Fixed values: FirstName=John, LastName=Doget, RegistrationDate=2025-05-17',
    '',
    'USE memberhub;',
    'GO',
    '',
    'INSERT INTO Members (FirstName, LastName, RegistrationDate, RegistrationNumber, Address, MobileNumber)',
    'VALUES',
];

const valueRows = data.map((row, index) => {
    const regNo = row['No.'];
    const mobile = String(row['Mobile Number'] ?? '').trim();
    const mobileSql = mobile ? `'${sqlEscape(mobile)}'` : 'NULL';
    const comma = index < data.length - 1 ? ',' : ';';
    return `    ('John', 'Doget', '2025-05-17', ${regNo}, '', ${mobileSql})${comma}`;
});

lines.push(...valueRows);
lines.push('');
lines.push(`-- Total rows: ${data.length}`);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');

console.log(`Written: ${outPath}`);
console.log(`Rows: ${data.length}`);
