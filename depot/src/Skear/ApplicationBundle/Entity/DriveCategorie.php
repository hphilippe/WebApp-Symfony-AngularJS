<?php

namespace Skear\ApplicationBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * DriveCategorie
 *
 * @ORM\Table(name="drive_categorie")
 * @ORM\Entity(repositoryClass="Skear\ApplicationBundle\Repository\DriveCategorieRepository")
 * @ORM\HasLifecycleCallbacks
 */
class DriveCategorie
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=true)
     */
    private $updateAt;

    /**
     * @ORM\PostLoad()
     */
    public function postLoad()
    {
        $this->updateAt = new \DateTime();
    }

    /**
     * @var string
     *
     * @ORM\Column(name="pathLogoImage", type="string", length=255)
     */
    private $pathLogoImage;

    public $file;

    public function getUploadRootDir()
    {
        return __dir__.'/../../../../web/uploads';
    }

    public function getAbsolutePath()
    {
        return null === $this->pathLogoImage ? null : $this->getUploadRootDir().'/'.$this->pathLogoImage;
    }

    public function getAssetPath()
    {
        return'uploads/'.$this->pathLogoImage;
    }

    /**
     * @ORM\PrePersist()
     * @ORM\PreUpdate()
     */
    public function preUpload()
    {
        $this->tempFile = $this->getAbsolutePath();
        $this->oldFile = $this->getPathLogoImage();
        $this->updateAt = new \DateTime();

        if(null !== $this->file)
        {
            $this->pathLogoImage = sha1(uniqid(mt_rand(),true)).'.'.$this->file->guessExtension();
        }
    }

    /**
     * @ORM\PostPersist()
     * @ORM\PostUpdate()
     */
    public function upload()
    {
        if(null !== $this->file)
        {
            $this->file->move($this->getUploadRootDir(),$this->pathLogoImage);
            unset($this->file);

            if($this->oldFile != null) unlink($this->tempFile);
        }
    }

    /**
     * @ORM\PreRemove()
     */
    public function preRemoveUpload()
    {
        $this->tempFile = $this->getAbsolutePath();
    }

    /**
     * @ORM\PostRemove()
     */
    public function RemoveUpload()
    {
        if(file_exists($this->tempFile)) unlink ($this->tempFile);
    }


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return DriveCategorie
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set pathLogoImage
     *
     * @param string $pathLogoImage
     *
     * @return DriveCategorie
     */
    public function setPathLogoImage($pathLogoImage)
    {
        $this->pathLogoImage = $pathLogoImage;

        return $this;
    }

    /**
     * Get pathLogoImage
     *
     * @return string
     */
    public function getPathLogoImage()
    {
        return $this->pathLogoImage;
    }
}

