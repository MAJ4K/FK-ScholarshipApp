import csv
import json

def make_json(csvFilePath, jsonFilePath, feildrow = 0):
	data = []
	with open(csvFilePath, newline='') as csvfile:
		csvrows = iter(csv.reader(csvfile))
		for i in range(feildrow): next(csvrows)
		csvDict = csv.DictReader(csvfile,next(csvrows))
		for row in csvDict:
			del row[""]
			data.append(row)
	with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
		jsonf.write(json.dumps(data, indent=4))

csvFilePath = r'test.csv'
jsonFilePath = r'scholarships.json'

make_json(csvFilePath, jsonFilePath, 1)