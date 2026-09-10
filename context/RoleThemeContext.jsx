'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { roleThemes, defaultThemeKey } from '../lib/roleThemes';

const RoleThemeContext = createContext({
  currentRole: defaultThemeKey,
  theme: roleThemes[defaultThemeKey],
  setRole: () => {},
  audioEnabled: false,
  toggleAudio: () => {},
  selectedNode: null,
  setSelectedNode: () => {},
  activeSimulation: null,
  triggerSimulation: () => {}
});

export function RoleThemeProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(defaultThemeKey);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeSimulation, setActiveSimulation] = useState(null);

  const theme = roleThemes[currentRole] || roleThemes[defaultThemeKey];

  const setRole = (roleKey) => {
    if (roleThemes[roleKey]) {
      setCurrentRole(roleKey);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
  };

  const triggerSimulation = (sim) => {
    setActiveSimulation(sim);
  };

  return (
    <RoleThemeContext.Provider
      value={{
        currentRole,
        theme,
        setRole,
        audioEnabled,
        toggleAudio,
        selectedNode,
        setSelectedNode,
        activeSimulation,
        triggerSimulation
      }}
    >
      {children}
    </RoleThemeContext.Provider>
  );
}

export function useRoleTheme() {
  return useContext(RoleThemeContext);
}
