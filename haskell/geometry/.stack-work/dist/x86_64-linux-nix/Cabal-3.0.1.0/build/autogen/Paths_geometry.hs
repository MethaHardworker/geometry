{-# LANGUAGE CPP #-}
{-# LANGUAGE NoRebindableSyntax #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
module Paths_geometry (
    version,
    getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir,
    getDataFileName, getSysconfDir
  ) where

import qualified Control.Exception as Exception
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude

#if defined(VERSION_base)

#if MIN_VERSION_base(4,0,0)
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#else
catchIO :: IO a -> (Exception.Exception -> IO a) -> IO a
#endif

#else
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#endif
catchIO = Exception.catch

version :: Version
version = Version [0,1,2,0] []
bindir, libdir, dynlibdir, datadir, libexecdir, sysconfdir :: FilePath

bindir     = "/home/sergey/dev/Haskell/geometry/haskell/geometry/.stack-work/install/x86_64-linux-nix/272bc3c51fa6fc4bdfdac252cde47d885304b54ea447521742e068b2caaad5e2/8.8.3/bin"
libdir     = "/home/sergey/dev/Haskell/geometry/haskell/geometry/.stack-work/install/x86_64-linux-nix/272bc3c51fa6fc4bdfdac252cde47d885304b54ea447521742e068b2caaad5e2/8.8.3/lib/x86_64-linux-ghc-8.8.3/geometry-0.1.2.0-3CTFcSZW00g4K978Q4vX2H"
dynlibdir  = "/home/sergey/dev/Haskell/geometry/haskell/geometry/.stack-work/install/x86_64-linux-nix/272bc3c51fa6fc4bdfdac252cde47d885304b54ea447521742e068b2caaad5e2/8.8.3/lib/x86_64-linux-ghc-8.8.3"
datadir    = "/home/sergey/dev/Haskell/geometry/haskell/geometry/.stack-work/install/x86_64-linux-nix/272bc3c51fa6fc4bdfdac252cde47d885304b54ea447521742e068b2caaad5e2/8.8.3/share/x86_64-linux-ghc-8.8.3/geometry-0.1.2.0"
libexecdir = "/home/sergey/dev/Haskell/geometry/haskell/geometry/.stack-work/install/x86_64-linux-nix/272bc3c51fa6fc4bdfdac252cde47d885304b54ea447521742e068b2caaad5e2/8.8.3/libexec/x86_64-linux-ghc-8.8.3/geometry-0.1.2.0"
sysconfdir = "/home/sergey/dev/Haskell/geometry/haskell/geometry/.stack-work/install/x86_64-linux-nix/272bc3c51fa6fc4bdfdac252cde47d885304b54ea447521742e068b2caaad5e2/8.8.3/etc"

getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath
getBinDir = catchIO (getEnv "geometry_bindir") (\_ -> return bindir)
getLibDir = catchIO (getEnv "geometry_libdir") (\_ -> return libdir)
getDynLibDir = catchIO (getEnv "geometry_dynlibdir") (\_ -> return dynlibdir)
getDataDir = catchIO (getEnv "geometry_datadir") (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "geometry_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "geometry_sysconfdir") (\_ -> return sysconfdir)

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir ++ "/" ++ name)
