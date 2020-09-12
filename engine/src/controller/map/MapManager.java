package controller.map;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class MapManager {
    private final Set<String> mapsSet;

    public MapManager() {
        mapsSet = new HashSet<>();
    }

    public synchronized void addMap(String mapName) {
        mapsSet.add(mapName);
    }

    public synchronized void removeMap(String mapName) {
        mapsSet.remove(mapName);
    }

    public synchronized Set<String> getMaps() {
        return Collections.unmodifiableSet(mapsSet);
    }

    public boolean isMapExists(String mapName) {
        return mapsSet.contains(mapName);
    }
}
