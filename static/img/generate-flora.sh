mkdir -p flora-von-deutschland-500
mkdir -p flora-von-deutschland-750
mkdir -p flora-von-deutschland-1024
cd flora-von-deutschland/
sips -s formatOptions 100 --resampleWidth 500 *.jpg --out ../flora-von-deutschland-500
sips -s formatOptions 80 --resampleWidth 750 *.jpg --out ../flora-von-deutschland-750
sips -s formatOptions 70 --resampleWidth 1024 *.jpg --out ../flora-von-deutschland-1024
cd ../
