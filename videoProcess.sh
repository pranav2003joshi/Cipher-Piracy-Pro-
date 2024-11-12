

process_video(){

    local videoUrl=$1
    local key=$2
    local iv=$3
    local number=$4
    # echo $number
    # echo "processing video url $videoUrl"


    folderName=${videoUrl##*master-}
    folderName=${folderName%.m3u8}

    #full_url="https://appx-transcoded-videos-mcdn.akamai.net.in/videos/smarteducationcenter-data/74632-1720934010/hls-drm-5183c4/360p/master-2672878.0393172526.m3u8"

    # Extract the base URL
    base_url=$(dirname "$videoUrl")/

    # Download the playlist file
    mkdir -p $folderName
    wget -O "$folderName/playlist.m3u8" "$videoUrl"

    # Extract segment filenames from the playlist file
    segment_files=$(awk -F'[ ,"]+' '/\.ts/ {print $NF}' "$folderName/playlist.m3u8")

    # Check if segment files were found
    if [ -z "$segment_files" ]; then
        echo "No segment files found in the playlist file."
        exit 1
    fi

    echo $segment_files

    
    IFS=$'\n' read -r -d '' -a segments <<< "$segment_files"


    for segment in "${segments[@]}"; do
        # echo "Downloading segment: ${base_url}${segment}"
        wget -O "$folderName/$segment" "${base_url}${segment}"  

        # echo "Reading segment: $segment"


        processed_segment="processed_$segment"
        # echo "Processing segment: $segment"

        # echo "Processing segment: $key"



        node main.js "$folderName" "$segment" "$key" "$iv"
        # echo "Processing finished segment: $segment" 
        # echo "Segments processed: $segment"

    done


    for f in $folderName/processed_*; do
        echo "file '$(pwd)/$f'" >> "$folderName/segments.txt"
    done

    node sortText.js $folderName
    # # Merge the decrypted segments into a single file
    ffmpeg -f concat -safe 0 -i $folderName/segments.txt -c copy $folderName/output.mp4

    #Clean up
    rm $folderName/processed_* $folderName/segments.txt $folderName/master_*



}

export -f process_video



# Get the full URL of the .m3u8 file


if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <csv_file>"
    exit 1
fi



export IFS=","



file="$1"

lineNumber=0;

# Read each line in the file
while IFS= read -r line
do
    # Execute your code here for each line
    echo "Processing: $line"
       
   url=$(echo "$line" | awk -F'|' '{
        gsub(/"/, "", $1)
        print $1
    }')

    # Extract key
    key=$(echo "$line" | awk -F'|' '{

        key = $2 
        print key
    }')

    echo "key is $key"

    # Extract iv
    iv=$(echo "$line" | awk -F'|' '{
       
        iv = $3
        print iv
    }')
    process_video "$url" "$key" "$iv" "$lineNumber"

done < "$file"

