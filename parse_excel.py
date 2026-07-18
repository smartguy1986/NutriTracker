import zipfile
import xml.etree.ElementTree as ET

def get_shared_strings(zf):
    strings = []
    try:
        with zf.open('xl/sharedStrings.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()
            for si in root.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                t = si.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                if t is not None:
                    strings.append(t.text)
                else:
                    strings.append("")
    except Exception as e:
        pass
    return strings

def parse_first_two_rows():
    with zipfile.ZipFile('/Users/arijitnandi/Desktop/calorietracker/INDB_2024.11.xlsx', 'r') as zf:
        shared_strings = get_shared_strings(zf)
        
        with zf.open('xl/worksheets/sheet1.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()
            
            rows = root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
            
            for i in range(min(5, len(rows))):
                row_data = []
                for c in rows[i].findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                    v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                    if v is not None:
                        val = v.text
                        if c.get('t') == 's':
                            val = shared_strings[int(val)]
                        row_data.append(val)
                    else:
                        row_data.append("")
                print(f"Row {i+1}:", row_data)

parse_first_two_rows()
