mkdir -p thumb-64
mkdir -p thumb-128
mkdir -p thumb-256
cd thumb/
sips -s formatOptions 100 --resampleHeight 64 *.jpg --out ../thumb-64
sips -s formatOptions 80 --resampleHeight 128 *.jpg --out ../thumb-128
sips -s formatOptions 70 --resampleHeight 256 *.jpg --out ../thumb-256
cd ../
