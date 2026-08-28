import zipfile
import xml.etree.ElementTree as ET
import json
import uuid

def read_xlsx(filename):
    with zipfile.ZipFile(filename, 'r') as z:
        shared_strings = []
        try:
            with z.open('xl/sharedStrings.xml') as f:
                tree = ET.parse(f)
                root = tree.getroot()
                for el in root.iter():
                    if el.tag.endswith('}t'):
                        shared_strings.append(el.text)
        except Exception as e:
            print("Shared strings not found or error:", e)

        with z.open('xl/worksheets/sheet1.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()
            rows = []
            for row in root.iter():
                if row.tag.endswith('}row'):
                    r = []
                    last_col = -1
                    for c in row:
                        if c.tag.endswith('}c'):
                            r_attr = c.attrib.get('r', '')
                            if r_attr:
                                col_str = ''.join([ch for ch in r_attr if ch.isalpha()])
                                col_idx = 0
                                for ch in col_str:
                                    col_idx = col_idx * 26 + (ord(ch.upper()) - ord('A') + 1)
                                col_idx -= 1
                                while last_col < col_idx - 1:
                                    r.append('')
                                    last_col += 1
                                last_col = col_idx
                            
                            v = c.find('.//{*}v')
                            if v is not None:
                                val = v.text
                                if c.attrib.get('t') == 's':
                                    val = shared_strings[int(val)]
                                r.append(val)
                            else:
                                r.append('')
                    rows.append(r)
            return rows

def parse_and_save():
    rows = read_xlsx('food_plans.xlsx')
    
    foods = []
    for r in rows[1:]:
        if len(r) < 3:
            continue
            
        try:
            name = str(r[2]).strip()
            if not name:
                continue
            
            category = str(r[1]).strip() if len(r) > 1 and r[1] else "Other"
                
            protein = float(r[4]) if len(r) > 4 and r[4] else 0.0
            fat = float(r[6]) if len(r) > 6 and r[6] else 0.0
            carbs = float(r[10]) if len(r) > 10 and r[10] else 0.0
            energy_kj = float(r[11]) if len(r) > 11 and r[11] else 0.0
            calories = energy_kj / 4.184
            
            foods.append({
                "id": str(uuid.uuid4()),
                "name": name,
                "category": category,
                "serving_size": "100",
                "serving_unit": "g",
                "calories": round(calories, 1),
                "protein": round(protein, 1),
                "carbs": round(carbs, 1),
                "fat": round(fat, 1)
            })
        except Exception as e:
            pass
            
    with open('src/data/foods.json', 'w') as f:
        json.dump(foods, f, indent=2)
        
    print(f"Successfully generated src/data/foods.json with {len(foods)} items.")

if __name__ == '__main__':
    parse_and_save()
