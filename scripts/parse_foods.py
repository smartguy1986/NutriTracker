import zipfile
import xml.etree.ElementTree as ET
import json
import uuid
import re

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
            pass

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
                            t_inline = c.find('.//{*}is/{*}t')
                            
                            if t_inline is not None and t_inline.text is not None:
                                r.append(t_inline.text)
                            elif v is not None and v.text is not None:
                                val = v.text
                                if c.attrib.get('t') == 's':
                                    val = shared_strings[int(val)]
                                r.append(val)
                            else:
                                r.append('')
                    rows.append(r)
            return rows

def parse_and_save():
    rows = read_xlsx('indian_food_nutrition.xlsx')
    
    foods = []
    # Skip header
    for r in rows[1:]:
        if len(r) < 20: # Make sure we have at least up to energy_kcal (index 19)
            continue
            
        try:
            name = str(r[1]).strip()
            if not name:
                continue
            
            category = str(r[2]).strip() if len(r) > 2 else "Other"
            
            piece_weight = None
            piece_unit = None
            
            try:
                def_unit = str(r[6]).strip().lower()
                def_grams = float(r[7]) if r[7] else None
                
                # If the default unit is something like '1 piece', '1 cup', extract it
                if def_unit and def_grams and def_unit != '100 g' and def_unit != '100g':
                    piece_unit = def_unit.replace('1 ', '')
                    piece_weight = def_grams
            except:
                pass

            try:
                calories = float(r[19]) if r[19] else 0.0
            except ValueError:
                calories = 0.0

            try:
                protein = float(r[11]) if r[11] else 0.0
            except ValueError:
                protein = 0.0
                
            try:
                fat = float(r[13]) if r[13] else 0.0
            except ValueError:
                fat = 0.0
                
            try:
                carbs = float(r[17]) if r[17] else 0.0
            except ValueError:
                carbs = 0.0

            food_obj = {
                "id": str(uuid.uuid4()),
                "name": name,
                "category": category,
                "serving_size": "100",
                "serving_unit": "g",
                "calories": round(calories, 1),
                "protein": round(protein, 1),
                "carbs": round(carbs, 1),
                "fat": round(fat, 1)
            }
            if piece_weight:
                food_obj["piece_weight"] = piece_weight
                food_obj["piece_unit"] = piece_unit
                
            foods.append(food_obj)
        except Exception as e:
            print("Failed to parse row:", r, "Error:", e)
            pass
            
    with open('src/data/foods.json', 'w') as f:
        json.dump(foods, f, indent=2)
        
    print(f"Successfully generated src/data/foods.json with {len(foods)} items.")

if __name__ == '__main__':
    parse_and_save()
